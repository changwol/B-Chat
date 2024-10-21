import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const ChatRoom = (props) => {
    const [client, setClient] = useState(null);
    const [content, setContent] = useState('');
    const [senderName, setSenderName] = useState('');
    const [messages, setMessages] = useState([]);
    // console.log("roomId : ",props.data);

    const roomId = props.data;

    const fetchInitialMessages = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:8080/rooms/${roomId}/findMessage`);
            const result = await response.json();
            setMessages(result);
        } catch (error) {
            console.error("문제 발생 :", error);
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
            };

            client.publish({
                destination: '/pub/message',
                body: JSON.stringify(payload),
            });
            console.log('메시지가 전송 완료:', payload);
            setContent('');
        } else {
            console.error('웹소켓 오류');
        }
    };

    return (
        <div>
            <h1>WebSocket with STOMP</h1>
            <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="보내는 사람 이름"
            />
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="메시지를 입력하세요"
            />
            <button onClick={sendMessage}>메시지 보내기</button>

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
