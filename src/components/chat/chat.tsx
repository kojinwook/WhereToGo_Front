import React, { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { GetChatMessageListRequest } from 'apis/apis';
import './style.css';

interface Message {
    sender: string;
    message: string;
    timestamp: string;
}

const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [username, setUsername] = useState<string>('qwer');
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected');
                client.subscribe('/topic/chat.1', (message: IMessage) => {
                    const parsedBody = JSON.parse(message.body);
                    const newMessage = parsedBody.body.chatMessage;
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
                client.subscribe(`/queue/chat.1`, (message: IMessage) => {
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
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await GetChatMessageListRequest(String(1));
            if (response.code === 'SU') {
                const chatMessageList = response.chatMessageList;
                if (chatMessageList && Array.isArray(chatMessageList)) {
                    const formattedMessages: Message[] = chatMessageList.map((msg: any) => ({
                        sender: msg.sender,
                        message: msg.message,
                        timestamp: msg.timestamp
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
        if (clientRef.current && input.trim()) {
            const message = {
                roomId: 1,
                sender: username,
                message: input,
                messageKey: new Date().getTime()
            };
            clientRef.current.publish({
                destination: '/app/chat/message',
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
            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === username ? 'sender' : 'receiver'}`}
                    >
                        <div className="message-container">
                            <div className="message-content">
                                <div className="text">{msg.message}</div>
                            </div>
                            <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
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
