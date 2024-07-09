import { ChatMessage } from "types/interface/chat-message.interface";
import ResponseDto from "../response.dto";

export default interface GetChatMessageListResponseDto extends ResponseDto{
    chatMessageList: ChatMessage[];
}