import { ResponseCode, ResponseMessage } from "../../types/enums/enums";
import Festival from "../../types/interface/festival.interface";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    festivalList:Festival[];
}