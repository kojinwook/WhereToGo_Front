import Answer from "types/interface/answer.interface";
import ResponseDto from "../response.dto";

export default interface GetAllAnswerResponseDto extends ResponseDto{
    answers : Answer[];
}