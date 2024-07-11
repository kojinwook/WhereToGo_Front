import { Festival } from "types/interface/interface";
import { ResponseCode, ResponseMessage } from "../../types/enums/enums";
import Review from "types/interface/review.interface";
import ChatMessage from "types/interface/chat-message.interface";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    festivalList:Festival[];
    festival: Festival;
    review: Review;
    reviews: Review[];
    average: Record<string, number>;
    chatMessageList: ChatMessage[];
}