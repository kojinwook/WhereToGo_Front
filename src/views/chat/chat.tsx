import React, { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GetChatMessageListRequest, GetChatRoomUsersRequest, GetUserRequest } from 'apis/apis';
import './style.css';
import useLoginUserStore from 'store/login-user.store';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import defaultProfileImage from 'assets/images/user.png';
import { log } from 'console';

interface Message {
    messageId: number; // 메시지 고유 ID
    sender: string;
    message: string;
    timestamp: string;
    readByReceiver: boolean; // 읽음 상태
}

const ChatRoom: React.FC = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<Client | null>(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const roomId = params.get('roomId');
    const { loginUser } = useLoginUserStore();
    const [nickname, setNickname] = useState<string>('');
    const [receiverNickname, setReceiverNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [cookies] = useCookies();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
        console.log(messages.map((msg) => msg.readByReceiver));
    }, [messages]);

    useEffect(() => {
        if (!roomId || !loginUser) return;
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected');
                client.subscribe(`/topic/chat.${roomId}`, (message: IMessage) => {
                    handleChatMessage(message);
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
    }, [roomId, loginUser]);

    const handleChatMessage = (message: IMessage) => {
        if (!loginUser) return;
        const parsedBody = JSON.parse(message.body);
        const newMessage: Message = {
            messageId: parsedBody.body.chatMessage.messageId,
            sender: parsedBody.body.chatMessage.sender,
            message: parsedBody.body.chatMessage.message,
            timestamp: parsedBody.body.chatMessage.timestamp,
            readByReceiver: parsedBody.body.chatMessage.readByReceiver,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // 상대방이 보낸 메시지이고, 해당 메시지를 자신이 보낸 것이 아닌 경우 읽음 상태를 업데이트
        // if (parsedBody.body.chatMessage.sender !== loginUser.nickname) {
        //     handleReadMessage(parsedBody.body.chatMessage.messageId);
        // }
    };

    useEffect(() => {
        if (!roomId || !loginUser) return;
        const getUserRequest = async () => {
            try {
                const response = await GetUserRequest(loginUser.userId, cookies.accessToken);
                if (!response) return;
                if (response.code === 'SU') {
                    const { nickname, profileImage } = response;
                    setNickname(nickname);
                    setProfileImage(profileImage);
                } else {
                    console.error('Failed to get user:', response.message);
                }
            } catch (error) {
                console.error('Failed to get user:', error);
            }
        }
        getUserRequest();
    }, [loginUser, cookies.access_token]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await GetChatMessageListRequest(String(roomId));
            if (response.code === 'SU') {
                const chatMessageList = response.chatMessageList;
                if (chatMessageList && Array.isArray(chatMessageList)) {
                    const formattedMessages: Message[] = chatMessageList.map((msg: any) => ({
                        messageId: msg.messageId,
                        sender: msg.sender,
                        message: msg.message,
                        timestamp: msg.timestamp,
                        readByReceiver: msg.readByReceiver,
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
            const messageKey = new Date().getTime();
            const message = {
                roomId: roomId,
                sender: loginUser.nickname,
                message: input,
                messageKey: messageKey
            };

            clientRef.current.publish({
                destination: `/app/chat/${roomId}/message`,
                body: JSON.stringify(message)
            });

            clientRef.current.publish({
                destination: `/app/chat/${roomId}/read`,
                body: JSON.stringify(messageKey)
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
            <div>{nickname}</div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === loginUser?.nickname ? 'sender' : 'receiver'}`}>
                        <div className="message-user-container">
                            {msg.sender !== loginUser?.nickname && (
                                <div className="profile-info">
                                    <img src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' className='user-profile-image' />
                                    <div className="nickname">{receiverNickname}</div> {/* 상대방 닉네임 표시 */}
                                </div>
                            )}
                            <div className="message-container">
                                <div className={`message-content ${msg.sender === loginUser?.nickname ? 'sender' : 'receiver'}`}>
                                    <div className="text">{msg.message}</div>
                                </div>
                                <div ref={messagesEndRef} />
                                <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
                                {msg.sender === loginUser?.nickname && !msg.readByReceiver && (
                                    <div className="unread-indicator">(1)</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
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
