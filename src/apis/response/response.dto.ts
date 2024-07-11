import { Festival, Notice } from "types/interface/interface";
import { ResponseCode, ResponseMessage } from "../../types/enums/enums";
<<<<<<< HEAD
import Question from "types/interface/question.interface";
=======
import Review from "types/interface/review.interface";
import ChatMessage from "types/interface/chat-message.interface";
>>>>>>> 00aed9276ad3fc48f16f8676d07b1db954575037

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    festivalList:Festival[];
<<<<<<< HEAD
    questions: Question[];
    notices : Notice[];
=======
    festival: Festival;
    review: Review;
    reviews: Review[];
    roomId: string;
    average: Record<string, number>;
    chatMessageList: ChatMessage[];
>>>>>>> 00aed9276ad3fc48f16f8676d07b1db954575037
}