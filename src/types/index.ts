import { ResponseDto } from "apis/response/response";


interface ResponseDtoWithSuccess extends ResponseDto{
    success: boolean;
};

type ResponseBody <T> = T | ResponseDtoWithSuccess | null;

export type {
    ResponseBody
};
