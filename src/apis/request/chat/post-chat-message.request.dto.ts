export default interface PostChatMessageRequestDto {
    roomId: number;
    sender: string;
    message: string;
    messageKey: string;
}