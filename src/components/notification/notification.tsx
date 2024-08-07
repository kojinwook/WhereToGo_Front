import React from 'react';
import ReactDOM from 'react-dom';
import Notification from 'types/interface/notification.interface';
import './style.css';

interface NotificationsModalProps {
    notifications: Notification[];
    meetingBoardTitles: Map<number, string>;
    onNotificationClick: (notification: Notification) => void;
    onDeleteNotification: (id: string) => void;
    onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ notifications, meetingBoardTitles, onNotificationClick, onDeleteNotification, onClose }) => {
    return ReactDOM.createPortal(
        <div className="notifications-modal-overlay">
            <div className="notifications-modal">
                <div className="notifications-modal-header">
                    <h3>알림</h3>
                    <button onClick={onClose}>X</button>
                </div>
                <div className="notifications-modal-content">
                    {notifications.length === 0 ? (
                        <p>알림이 없습니다.</p>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className={`notifications ${notification.type === 'CHAT' ? 'chat-notification' : ''}`} onClick={() => onNotificationClick(notification)}>
                                {notification.type === 'CHAT' ? (
                                    <div>
                                        <span>{notification.senderId}님이 채팅을 보냈습니다.</span>
                                        <br />
                                        <span>{notification.message}</span>
                                    </div>
                                ) : (
                                        
                                    <div>
                                        <span>{notification.replySender}님이 {meetingBoardTitles.get(notification.meetingBoardId!)}에 댓글을 작성했습니다.</span>
                                        <br />
                                        <span>{notification.replyContent}</span>
                                    </div>
                                )}
                                <button onClick={(e) => { e.stopPropagation(); onDeleteNotification(notification.id); }}>삭제</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NotificationsModal;
