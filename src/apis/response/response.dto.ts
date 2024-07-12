import { Answer, Festival, Notice } from "types/interface/interface";
import { ResponseCode, ResponseMessage } from "../../types/enums/enums";
import Question from "types/interface/question.interface";
import Review from "types/interface/review.interface";
import ChatMessage from "types/interface/chat-message.interface";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    festivalList:Festival[];
    questions: Question[];
    notices : Notice[];
    festival: Festival;
    review: Review;
    reviews: Review[];
    roomId: string;
    answer: Answer[];
    average: Record<string, number>;
    chatMessageList: ChatMessage[];
}