export default interface Notification {
    id: string;
    chatRoomId: string;
    senderId: string;
    message: string;
    meetingId: number;
    meetingBoardId: number;
    replySender: string;
    replyContent: string;
    content: string;
    createdAt: Date;
    read: boolean;
}