import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import ChatRoom from "./ChatRoom.js";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8080/room";

const LeftComponent = ({ roomInfos, onClick }) => {
  return (
      <div className="left-panel">
        {roomInfos.length > 0 ? (
            roomInfos.map(({ id, roomName }) => (
                <button key={id} onClick={() => onClick(id)}>
                  {`ChatRoom ${roomName} (${id}) 열기`}
                </button>
            ))
        ) : (
            <p>방이 없습니다.</p>
        )}
      </div>
  );
};

const RightComponent = ({ chatRoomVisible, data }) => {
  return (
      <div className="right-panel">
        {chatRoomVisible ? <ChatRoom data={data} /> : <h2>ChatRoom이 열리지 않았습니다.</h2>}
      </div>
  );
};

const ChatPage = () => {
  const navigate = useNavigate();
  const [chatRoomVisible, setChatRoomVisible] = useState(false);
  const [data, setData] = useState("");
  const [roomInfos, setRoomInfos] = useState([]); // 방 정보 배열 상태
  const [memberData, setMemberData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

  // 사용자 데이터 가져오기
  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    console.log("토큰: " + token);

    const fetchUserData = async () => {
      setLoadingUser(true); // 사용자 데이터 로딩 시작
      try {
        const response = await axios.get(`${baseUrl}/memberId`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.data) {
          setMemberData(response.data); // API에서 받은 데이터로 상태 업데이트
          console.log("유저 데이터:", response.data);
        } else {
          setErrorMessage("회원 정보가 없습니다.");
        }
      } catch (error) {
        setErrorMessage("데이터를 불러오는 데 실패했습니다.");
        console.error("Error:", error);
      } finally {
        setLoadingUser(false); // 사용자 데이터 로딩 종료
      }
    };

    fetchUserData();
  }, [navigate]);

  // 방 ID 가져오기
  useEffect(() => {
    const fetchRoomIds = async () => {
      if (!memberData) return; // memberData가 없으면 요청하지 않음
      setLoadingRooms(true); // 방 ID 로딩 시작
      try {
        const response = await fetch(`${baseUrl}/find/${memberData}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setRoomInfos(result); // 방 정보를 포함하는 배열로 상태 업데이트
        console.log("roomInfos:", result);
      } catch (error) {
        setErrorMessage("방 ID를 가져오는 데 실패했습니다.");
        console.error("Error fetching room IDs:", error);
      } finally {
        setLoadingRooms(false); // 방 ID 로딩 종료
      }
    };

    fetchRoomIds();
  }, [memberData]); // memberData가 변경될 때마다 실행

  const handleChatRoomOpen = (id) => {
    setData(id); // 이 id는 roomId로 사용
    setChatRoomVisible(true);
  };

  return (
      <div className="grid-container">
        {(loadingUser || loadingRooms) && <p>Loading...</p>} {/* 로딩 메시지 */}
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 에러 메시지 표시 */}
        <LeftComponent roomInfos={roomInfos} onClick={handleChatRoomOpen} />
        <RightComponent chatRoomVisible={chatRoomVisible} data={data} /> {/* data를 roomId로 사용 */}
      </div>
  );
};

export default ChatPage;
