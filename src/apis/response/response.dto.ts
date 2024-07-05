import { Festival } from "types/interface/interface";
import { ResponseCode, ResponseMessage } from "../../types/enums/enums";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    festivalList:Festival[];
    average: number;
}