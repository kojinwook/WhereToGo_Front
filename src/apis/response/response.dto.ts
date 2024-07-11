import { Festival, Notice } from "types/interface/interface";
import { ResponseCode, ResponseMessage } from "../../types/enums/enums";
import Question from "types/interface/question.interface";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    festivalList:Festival[];
    questions: Question[];
    notices : Notice[];
}