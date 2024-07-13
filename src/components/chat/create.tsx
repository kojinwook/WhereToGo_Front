import { PostChatRoomRequest } from 'apis/apis';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';

const ChatRoomCreate: React.FC = () => {
    const {loginUser} = useLoginUserStore();
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState<string>('');
    const [cookies, setCookie] = useCookies();
    const nickname = loginUser?.nickname;
    let creatorNickname = "qwer"
    let creatorProfileImage = "aa";

    const handleCreateRoom = async () => {
        if(!roomName || !nickname || !creatorNickname || !creatorProfileImage) return;
        try {
            const response = await PostChatRoomRequest({ roomName, nickname, creatorNickname, creatorProfileImage}, cookies.access_token);
            console.log(response);
            if (response.code === 'SU') {
                const roomId = response.roomId;
                if (roomId) {
                    navigate(`/chat?roomId=${roomId}&creatorNickname=${creatorNickname}&creatorProfileImage=${creatorProfileImage}`);
                } else {
                    console.error('Failed to create chat room: No roomId returned');
                }
            } else {
                console.error('Failed to create chat room:', response.message);
            }
        } catch (error) {
            console.error('Failed to create chat room:', error);
        }
    };

    return (
        <div className="chat-room-create">
            <h2>Create a New Chat Room</h2>
            <label htmlFor="roomName">Room Name:</label>
            <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom}>Create Room</button>
        </div>
    );
};

export default ChatRoomCreate;
