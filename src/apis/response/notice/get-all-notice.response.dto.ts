import Notice from "types/interface/notice.interface";
import ResponseDto from "../response.dto";



export default interface GetAllNoticeResponseDto extends ResponseDto, Notice {
    notices: Notice[];
}