import React, {useEffect, useState} from "react";
import "./ChatPage.css";
import ChatRoom from "./ChatRoom.js";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Client} from '@stomp/stompjs'
import Header from "../components/ui/Header.jsx";

const baseUrl = "b-link.kro.kr:8080";

const LeftComponent = ({roomInfos, searchData, onClick, handleSearch, onSearchClear, handleCreateChatRoom}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const onSearchChange = (e) => {
        setSearchTerm(e.target.value);
        handleSearch(e.target.value); // 검색어가 변경될 때마다 검색어 전송
    };

    const handleClick = () => {
        setSearchTerm(""); // 검색어 초기화
        onSearchClear(); // 검색 결과 초기화
    };

    return (
        <div>

            <div>
                <div className="left-panel">
                    {/* 검색 입력창 */}
                    <input
                        type="text"
                        placeholder="검색"
                        value={searchTerm}
                        onChange={onSearchChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginBottom: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc'
                        }}
                        // onClick={handleClick} // 검색창 포커스 시 초기화
                    />

                    {/* 검색 결과 */}
                    <div style={{position: 'relative'}}>
                        {searchData && searchData.length > 0 ? (
                            <div className="search-results">
                                {searchData.map(({memberId, memberName}) => (
                                    <div
                                        key={memberId}
                                        className="search-result-item"
                                        onClick={() => {
                                            handleCreateChatRoom(memberId, memberName);
                                            handleClick();
                                        }} // 수정된 부분
                                    >
                                        {`Member: ${memberName}`}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                    {/* 방 정보 버튼 */}
                    {roomInfos && roomInfos.length > 0 ? (
                        roomInfos.map(({id, roomName}) => (
                            <button key={id} onClick={() => onClick(id)}>
                                {`${roomName}`}
                            </button>
                        ))
                    ) : (
                        <p>방이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const RightComponent = ({chatRoomVisible, roomId, senderId, senderName}) => {
    return (
        <div className="right-panel">
            {chatRoomVisible ? (
                <ChatRoom
                    data={roomId} // roomId 전달
                    senderId={senderId}
                    senderName={senderName}
                />
            ) : (
                <h2>ChatRoom이 열리지 않았습니다.</h2>
            )}
        </div>
    );
};


const ChatPage = () => {
    const navigate = useNavigate();
    const [chatRoomVisible, setChatRoomVisible] = useState(false);
    const [data, setData] = useState("");
    const [searchData, setSearchData] = useState([]); // 초기값을 빈 배열로 설정
    const [memberData, setMemberData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [senderId, setSenderId] = useState(null);
    const [senderName, setSenderName] = useState(null);
    const [roomInfos, setRoomInfos] = useState([]); // 초기값을 빈 배열로 설정
    const [client, setClient] = useState(null);
    const [memberName, setMemberName] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [roomId, setRoomId] = useState(null);

    const fetchRoomIds = async () => {
        if (!memberData) return; // memberData가 없으면 요청하지 않음
        setLoadingRooms(true); // 방 ID 로딩 시작
        try {
            const response = await fetch(`http://${baseUrl}/room/find/${memberData}/findRoom`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setRoomInfos(result); // 방 정보를 포함하는 배열로 상태 업데이트
        } catch (error) {
            console.error("Error fetching room IDs:", error);
        } finally {
            setLoadingRooms(false); // 방 ID 로딩 종료
        }
    };
    const fetchUserData = async () => {
        const token = localStorage.getItem("Authorization");
        setLoadingUser(true); // 사용자 데이터 로딩 시작
        try {
            const response = await axios.get(`http://${baseUrl}/room/memberId`, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.data) {
                setMemberData(response.data); // API에서 받은 데이터로 상태 업데이트
                setSenderId(response.data); // senderId를 상태로 업데이트
            } else {
                console.error("Error");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoadingUser(false); // 사용자 데이터 로딩 종료
        }
    };


    // 사용자 데이터 가져오기
    useEffect(() => {

        fetchUserData();
        fetchRoomIds();
    }, [memberData]); // navigate가 변경될 때마다 사용자 데이터 가져오기

    useEffect(() => {
        const token = localStorage.getItem("Authorization");

        const fetchUserName = async () => {
            setLoadingUser(true); // 사용자 데이터 로딩 시작
            try {
                const response = await axios.get(`http://${baseUrl}/room/memberName`, {
                    headers: {
                        Authorization: token,
                    },
                });
                if (response.data) {
                    setSenderName(response.data); // API에서 받은 데이터로 상태 업데이트
                } else {
                    setErrorMessage("회원 정보가 없습니다.");
                    navigate('/login'); // 로그인 페이지로 리다이렉트
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoadingUser(false); // 사용자 데이터 로딩 종료
            }
        };

        fetchUserName();
    }, [navigate]); // navigate가 변경될 때마다 사용자 데이터 가져오기

    // 방 ID 가져오기
    useEffect(() => {
        const stompClient = new Client({
            brokerURL: `ws://${baseUrl}/ws`,
            onConnect: () => {
                console.log('웹소켓 성공');
                // stompClient.subscribe(`/sub/addRoom/${memberData}`, message => {
                //     const roomData = JSON.parse(message.body);
                //     console.log('메세지 :', roomData);
                //     setRoomInfos(prevMessages => [...prevMessages, roomData]);
                // });
            },
            onStompError: (frame) => {
                console.error('STOMP 에러:', frame.headers['message']);
            },
        });

        stompClient.activate();
        setClient(stompClient);

    }, [navigate]);

    const handleSearch = async (searchTerm) => {
        if (searchTerm) {
            try {
                const response = await axios.get(`http://${baseUrl}/room/user/${searchTerm}`);
                if (Array.isArray(response.data)) {
                    const formattedData = response.data.map(member => ({
                        memberId: member.memberId,
                        memberName: member.memberName
                    }));
                    setSearchData(formattedData);
                } else {
                    console.error("응답 데이터가 배열이 아닙니다:", response.data);
                    setSearchData([]);
                }
            } catch (error) {
                console.error("검색 중 오류 발생:", error);
            }
        } else {
            console.log("검색어가 비어있습니다.");
        }
    };

    const handleSearchClear = () => {
        setSearchData([]); // 검색 결과 초기화
        // setRoomInfos([]); // 방 정보 초기화 코드 제거
    };


    const handleCreateChatRoom = async (memberId, memberName) => {
        if (client && client.connected) {
            const payload = {
                roomName: "채팅방 : " + senderName + memberName,
                member1: senderName,
                member1Id: senderId,
                member2: memberName,
                member2Id: memberId,
            };
            client.publish({
                destination: `/app/create`,
                body: JSON.stringify(payload),
            });
            console.log("데이터 전송 완료", payload);
        } else {
            console.error('웹소켓 연결 x');
        }
    };


    const handleChatRoomOpen = (roomId, id, name) => {
        setRoomId(roomId);
        setMemberId(id);
        setMemberName(name);
        setChatRoomVisible(true);
    };


    return (
        <div>
            <Header/>
            <div className="grid-container">
                {loadingUser && <p>Loading...</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <LeftComponent
                    roomInfos={roomInfos}
                    searchData={searchData}
                    onClick={handleChatRoomOpen}
                    handleSearch={handleSearch}
                    onSearchClear={handleSearchClear} // 검색 초기화 함수 전달
                    handleCreateChatRoom={handleCreateChatRoom}
                />
                <RightComponent
                    chatRoomVisible={chatRoomVisible}
                    roomId={roomId}
                    senderId={senderId}
                    senderName={senderName}/>
            </div>
        </div>

    );
};

export default ChatPage;
