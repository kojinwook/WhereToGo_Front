import Notice from "types/interface/notice.interface";
import ResponseDto from "../response.dto";


export default interface DeleteNoticeResponseDto extends ResponseDto, Notice{
    // notices : Notice[];
}