import { ChatRoom } from "types/interface/interface";
import ResponseDto from "../response.dto";

export default interface GetChatRoomResponseDto extends ResponseDto{
    chatRoomList: ChatRoom[];
}