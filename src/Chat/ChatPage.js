import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import ChatRoom from "./ChatRoom.js";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8080/room";

const LeftComponent = ({ roomIds, onClick }) => {
  return (
    <div className="left-panel">
      {roomIds.length > 0 ? (
        roomIds.map((roomId) => (
          <button key={roomId} onClick={() => onClick(roomId)}>
            {`ChatRoom ${roomId} 열기`}
          </button>
        ))
      ) : (
        <p>방이 없습니다.</p>
      )}
    </div>
  );
};

const RightComponent = ({ chatRoomVisible, data }) => {
  return <div className="right-panel">{chatRoomVisible ? <ChatRoom data={data} /> : <h2>ChatRoom이 열리지 않았습니다.</h2>}</div>;
};

const ChatPage = () => {
  const { id: memberId } = useParams(); // URL에서 memberId를 가져옴
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [chatRoomVisible, setChatRoomVisible] = useState(false);
  const [data, setData] = useState("");
  const [roomIds, setRoomIds] = useState([]);
  const [memberData, setMemberData] = useState(null);

  // 사용자 데이터 가져오기
  useEffect(() => {
    const token = localStorage.getItem("Authorization"); // 로컬 스토리지에서 토큰 가져오기
    console.log("토큰" + token);
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/find/memberId`, {
          headers: {
            Authorization: token,
          },
        });
        if (response.data) {
          setMemberData(response.data); // API에서 받은 데이터로 상태 업데이트
          console.log(response.data);
        } else {
          console.error("회원 정보가 없습니다.");
        }
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다.", error);
        navigate("/login"); // 로그인 페이지로 리다이렉트
      }
    };
    fetchUserData();
  }, [navigate]); // navigate가 변경될 때마다 실행

  // 방 ID 가져오기
  useEffect(() => {
    const fetchRoomIds = async () => {
      try {
        const response = await fetch(`${baseUrl}/${memberData}`); // 템플릿 리터럴을 사용하여 URL 구성
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setRoomIds(result); // 방 ID 목록을 상태에 저장
        console.log("roomID: ", result);
      } catch (error) {
        console.error("Error fetching room IDs:", error);
      }
    };

    fetchRoomIds();
  }, [memberId]); // memberId가 변경될 때마다 API 요청

  const handleChatRoomOpen = (roomId) => {
    setData(roomId);
    setChatRoomVisible(true);
  };

  return (
    <div className="grid-container">
      <LeftComponent roomIds={roomIds} onClick={handleChatRoomOpen} />
      <RightComponent chatRoomVisible={chatRoomVisible} data={data} />
    </div>
  );
};

export default ChatPage;
