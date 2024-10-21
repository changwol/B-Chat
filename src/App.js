import React, { useEffect, useState } from 'react';
import './App.css';
import ChatRoom from './Chat/ChatRoom.js';

const LeftComponent = ({ onClick }) => {
    return (
        <div className="left-panel">
            <button onClick={() => onClick("room1")}>ChatRoom 1 열기</button>
            <button onClick={() => onClick("room2")}>ChatRoom 2 열기</button>
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

const App = () => {
    const [chatRoomVisible, setChatRoomVisible] = useState(false);
    const [data, setData] = useState("");

    const handleChatRoomOpen = (roomId) => {
        setData(roomId);
        setChatRoomVisible(true);
    };

    return (
        <div className="grid-container">
            <LeftComponent onClick={handleChatRoomOpen} />
            <RightComponent chatRoomVisible={chatRoomVisible} data={data} />
        </div>
    );
};

export default App;
