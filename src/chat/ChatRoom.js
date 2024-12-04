import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const ChatRoom = ({ data: roomId , senderId, senderName: senderName }) => { // props를 구조 분해 할당
    const [client, setClient] = useState(null);
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchInitialMessages = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/rooms/${roomId}/findMessage`);
            if (!response.ok) {
                throw new Error('메시지를 가져오는 데 실패했습니다.');
            }
            const result = await response.json();
            setMessages(result);
        } catch (error) {
            console.error("문제 발생 :", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialMessages(roomId); // 초기 메시지를 가져옵니다.

        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            onConnect: () => {
                console.log('웹소켓 성공');
                stompClient.subscribe(`/sub/rooms/${roomId}`, message => {
                    const receivedMessage = JSON.parse(message.body);
                    console.log('메세지 :', receivedMessage);
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP 에러:', frame.headers['message']);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [roomId]);

    const sendMessage = () => {
        if (client && client.connected) {
            const payload = {
                senderName: senderName,
                roomId: roomId,
                content: content,
                senderId: senderId,
            };

            client.publish({
                destination: '/app/message',
                body: JSON.stringify(payload),
            });
            console.log('메시지가 전송 완료:', payload);
            setContent(''); // 메시지 전송 후 입력 필드 초기화
        } else {
            console.error('웹소켓 연결이 되어 있지 않습니다.');
        }
    };

    return (
        <div>
            <h1>WebSocket with STOMP</h1>
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="메시지를 입력하세요"
            />
            <button onClick={sendMessage}>메시지 보내기</button>

            {loading && <p>로딩 중...</p>}
            {error && <p className="error-message">{error}</p>}

            <div>
                <h2>수신한 메시지</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.senderName}:</strong> {msg.content}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChatRoom;
