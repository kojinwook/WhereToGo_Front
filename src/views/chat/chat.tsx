import React, { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GetChatMessageListRequest, GetUserRequest } from 'apis/apis';
import './style.css';
import useLoginUserStore from 'store/login-user.store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import defaultProfileImage from 'assets/images/user.png';

interface Message {
    messageId: number;
    sender: string;
    message: string;
    timestamp: string;
    readByReceiver: boolean;
}

interface TypingMessage {
    roomId: string;
    sender: string;
    typing: boolean;
}

interface UserStatus {
    username: string;
    online: boolean;
}

const TYPING_TIMEOUT = 3000;

const ChatRoom: React.FC = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<Client | null>(null);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const roomId = params.get('roomId');
    const { loginUser } = useLoginUserStore();
    const [nickname, setNickname] = useState<string>('');
    const stompClient = useRef<any>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [cookies] = useCookies();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [otherUserTyping, setOtherUserTyping] = useState<string[]>([]);
    const [otherUserStatus, setOtherUserStatus] = useState<UserStatus[]>([]);
    const [chatPartnerNickname, setChatPartnerNickname] = useState<string>(''); // 상대방 닉네임 상태 변수 추가
    const navigator = useNavigate();
    const userId = params.get('userId'); // userId를 URL에서 가져오기

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
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
                client.subscribe(`/topic/typing.${roomId}`, (message: IMessage) => {
                    handleTypingMessage(message);
                });
                client.subscribe(`/topic/status`, (message: IMessage) => {
                    handleStatusMessage(message);
                });
                client.publish({
                    destination: `/app/chat/${roomId}/enter`,
                    headers: {},
                    body: JSON.stringify({
                        roomId: roomId,
                        username: loginUser.nickname,
                        message: 'Entered the chat room',
                    }),
                });
                fetchMessages();
                if (userId) {
                    fetchChatPartnerNickname();
                }
            },
            onDisconnect: () => {
                console.log('Disconnected');
                client.publish({
                    destination: `/app/chat/${roomId}/leave`,
                    headers: {},
                    body: JSON.stringify({
                        username: loginUser.nickname,
                        message: 'Left the chat room',
                    }),
                });
            },
        });
        client.activate();
        clientRef.current = client;
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [roomId, loginUser, userId]);

    const fetchChatPartnerNickname = async () => {
        if (!userId) return; // userId가 없으면 함수 종료
        try {
            const response = await GetUserRequest(userId);
            if (response) {
                if (response.code === 'SU') {
                    setChatPartnerNickname(response.nickname);
                } else {
                    console.error('Failed to get chat partner:', response.message);
                }
            } else {
                console.error('Failed to get chat partner: Response is null');
            }
        } catch (error) {
            console.error('Failed to get chat partner:', error);
        }
    };

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

        if (newMessage.sender !== loginUser.nickname) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    };

    const handleTypingMessage = (message: IMessage) => {
        if (!loginUser) return;
        const parsedBody: TypingMessage = JSON.parse(message.body);
        if (parsedBody.sender !== loginUser.nickname) {
            if (parsedBody.typing) {
                setOtherUserTyping((prev) => [...prev, parsedBody.sender]);
            } else {
                setOtherUserTyping((prev) => prev.filter((user) => user !== parsedBody.sender));
            }
        }
    };

    const handleStatusMessage = (message: IMessage) => {
        if (!loginUser) return;
        const parsedBody: UserStatus = JSON.parse(message.body);
        setOtherUserStatus((prev) => {
            const existingUserIndex = prev.findIndex(user => user.username === parsedBody.username);
            if (existingUserIndex !== -1) {
                const updatedStatus = [...prev];
                updatedStatus[existingUserIndex] = parsedBody;
                return updatedStatus;
            } else {
                return [...prev, parsedBody];
            }
        });
    };

    useEffect(() => {
        if (!roomId || !loginUser) return;
        const getUserRequest = async () => {
            try {
                const response = await GetUserRequest(loginUser.userId);
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
    }, [loginUser, cookies.accessToken]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await GetChatMessageListRequest(String(roomId));
            if (!response) return;
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
        }
        if (clientRef.current && input.trim()) {
            const messageKey = new Date().getTime();
            const notification = {
                roomId: roomId,
                sender: loginUser.nickname,
                message: input,
                messageKey: messageKey
            };
            clientRef.current.publish({
                destination: `/app/chat/message`,
                body: JSON.stringify(notification)
            });
        }
        setInput('');
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        sendTypingStatus(true);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            sendTypingStatus(false);
        }, TYPING_TIMEOUT);
    };

    const sendTypingStatus = (isTyping: boolean) => {
        if (clientRef.current && roomId) {
            const typingMessage = {
                roomId: roomId,
                sender: loginUser?.nickname,
                typing: isTyping
            };
            clientRef.current.publish({
                destination: `/app/chat/${roomId}/typing`,
                body: JSON.stringify(typingMessage)
            });
        }
    };

    const backPathClickHandler = () => {
        window.history.back();
    };

    return (
        <div className="chat-room">
            <div className="back-button">
                <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backPathClickHandler} />
                <div className="message-nickname">{chatPartnerNickname || '채팅 상대'}</div>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === loginUser?.nickname ? 'sender' : 'receiver'}`}>
                        <div className="message-user-container">
                            {msg.sender !== loginUser?.nickname && (
                                <div className="message-header">
                                    <div className="profile-info">
                                        <img src={profileImage ? profileImage : defaultProfileImage} alt="profile" />
                                        <div className="username">{msg.sender}</div>
                                    </div>
                                </div>
                            )}
                            <div className="message-body">
                                <div className="message-text">{msg.message}</div>
                                <div className="message-time">{formatTimestamp(msg.timestamp)}</div>
                            </div>
                        </div>
                        {msg.sender === loginUser?.nickname && !msg.readByReceiver && (
                            <div className="unread-indicator"></div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <input
                    type="text"
                    className="message-input"
                    placeholder="메시지 입력..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : null}
                />
                <button className="send-button" onClick={sendMessage}>전송</button>
            </div>
            <div className="typing-status">
                {otherUserTyping.length > 0 &&
                    <div>{otherUserTyping}님이 입력 중입니다...</div>
                }
                {otherUserStatus.map((user, index) => (
                    <div key={index}>
                        {user.online ? `${user.username}님이 온라인입니다.` : `${user.username}님이 오프라인입니다.`}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatRoom;
