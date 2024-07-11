export default interface ChatMessage {
    messageId: string;
    message: string;
    messageKey: string;
    roomId: string;
    timestamp: Date;
    sender: string;
}