import User from "./user.interface";

export default interface ChatRoom {
    roomId: string;
    roomName: string;
    userId: string;
    nickname: string;
    creatorNickname: string;
    creator: User;
    user: User;
    lastMessage: string | null;
    lastMessageTimestamp: string;
}