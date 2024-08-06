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
                    <button onClick={onClose}>닫기</button>
                </div>
                <div className="notifications-modal-content">
                    {notifications.length === 0 ? (
                        <p>알림이 없습니다.</p>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className={`notifications ${notification.type === 'CHAT' ? 'chat-notification' : ''}`} onClick={() => onNotificationClick(notification)}>
                                {notification.type === 'CHAT' ? (
                                    <span>{notification.message} : {notification.senderId}</span>
                                ) : (
                                    <span>{notification.replySender} : {meetingBoardTitles.get(notification.meetingBoardId!)} : {notification.replyContent}</span>
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
