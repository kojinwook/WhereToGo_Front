import React, { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GetChatMessageListRequest } from 'apis/apis';
import './style.css';
import useLoginUserStore from 'store/login-user.store';
import { useLocation } from 'react-router-dom';

interface Message {
    sender: string;
    message: string;
    timestamp: string;
}

const ChatRoom: React.FC = () => {
    const clientRef = useRef<Client | null>(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const roomId = params.get('roomId');
    const receiverNickname = params.get('creatorNickname');
    const receiverProfileImage = params.get('creatorProfileImage');
    const { loginUser } = useLoginUserStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        if (!roomId || !receiverNickname || !receiverProfileImage) {
            console.error('Missing required props: roomId, receiverNickname, receiverProfileImage');
            return;
        }

        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected');
                client.subscribe(`/topic/chat.${roomId}`, (message: IMessage) => {
                    const parsedBody = JSON.parse(message.body);
                    const newMessage: Message = parsedBody.body.chatMessage;
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
                client.subscribe(`/queue/chat.${roomId}`, (message: IMessage) => {
                    const newMessage: Message = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
                fetchMessages();
            },
            onDisconnect: () => {
                console.log('Disconnected');
            }
        });
        client.activate();
        clientRef.current = client;
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [roomId]);

    const fetchMessages = async () => {
        try {
            const response = await GetChatMessageListRequest(String(roomId));
            if (response.code === 'SU') {
                const chatMessageList = response.chatMessageList;
                if (chatMessageList && Array.isArray(chatMessageList)) {
                    const formattedMessages: Message[] = chatMessageList.map((msg: any) => ({
                        sender: msg.sender,
                        message: msg.message,
                        timestamp: msg.timestamp,
                        profileImage: msg.profileImage
                    }));
                    setMessages(formattedMessages);
                }
            } else {
                console.error('Failed to fetch messages:', response.message);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = () => {
        if (!loginUser) {
            alert('로그인이 필요합니다.');
            return;
        };
        if (clientRef.current && input.trim()) {
            const message = {
                roomId: roomId,
                sender: loginUser.nickname,
                message: input,
                messageKey: new Date().getTime()
            };
            clientRef.current.publish({
                destination: `/app/chat/${roomId}/message`,
                body: JSON.stringify(message)
            });
            setInput('');
        }
    };

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        return date.toLocaleString('ko-KR', options);
    };

    return (
        <div className="chat-room">
            <div>{receiverNickname}</div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === loginUser?.nickname ? 'sender' : 'receiver'}`}>
                        <div className="message-user-container">
                            {msg.sender !== loginUser?.nickname && (
                                <div className="profile-info">
                                    {/* <img src={receiverProfileImage} alt="Profile" className="profile-image" /> */}
                                    <div className="nickname">{receiverNickname}</div>
                                </div>
                            )}
                            <div className="message-container">
                                <div className={`message-content ${msg.sender === loginUser?.nickname ? 'sender' : 'receiver'}`}>
                                    <div className="text">{msg.message}</div>
                                </div>
                                <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatRoom;