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
    sender: string;
    message: string;
    timestamp: string;
}

const ChatRoom: React.FC = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<Client | null>(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const roomId = params.get('roomId');
    const receiverUserId = params.get('userId');
    const { loginUser } = useLoginUserStore();
    const [nickname, setNickname] = useState<string>('');
    const [senderNickname, setSenderNickname] = useState<string>('');
    const [receiverNickname, setReceiverNickname] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [cookies, setCookie] = useCookies();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        if (!loginUser) return;
        setSenderNickname(loginUser.nickname);
    }, [loginUser]);

    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!loginUser) {
            alert('로그인이 필요합니다.');
            return;
        }
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

    useEffect(() => {
        if (!roomId || !loginUser) return;
        const getRoomUsers = async () => {
            try {
                // 채팅방의 유저 정보 가져오기
                const response = await GetChatRoomUsersRequest(roomId, cookies.accessToken);
                console.log(response);
                if (response.code === 'SU') {
                    // 현재 로그인한 유저와 상대방의 닉네임 설정
                    const roomUsers = response.users;
                    const roomUser = roomUsers.find(user => user.userId !== loginUser.userId);
                    if (roomUser) {
                        setReceiverNickname(roomUser.nickname);
                    }
                } else {
                    console.error('Failed to get room users:', response.message);
                }
            } catch (error) {
                console.error('Failed to get room users:', error);
            }
        }
        getRoomUsers();
    }, [roomId, loginUser, cookies.access_token]);

    useEffect(() => {
        if (!roomId) {
            console.error('Missing required props: roomId');
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

    const convertMessageToLinks = (message: string): (JSX.Element | string)[] => {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return message.split(urlPattern).map((part, index) => {
            if (urlPattern.test(part)) {
                return (
                    <a
                        href={part}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => handleLinkClick(e, part)}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };


    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        if (e.ctrlKey || e.metaKey) {
            window.open(url, '_blank');
        } else {
            e.preventDefault();
        }
    };

    const renderMessageContent = (message: Message) => {
        return convertMessageToLinks(message.message);
    };

    console.log(senderNickname, nickname);
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
                                    <div className="text">{renderMessageContent(msg)}</div>
                                </div>
                                <div ref={messagesEndRef} />
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