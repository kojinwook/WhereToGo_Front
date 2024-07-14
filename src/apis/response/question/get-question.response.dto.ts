import Question from "types/interface/question.interface";
import ResponseDto from "../response.dto";

export default interface GetQuestionResponseDto extends ResponseDto{
    question : Question;
}