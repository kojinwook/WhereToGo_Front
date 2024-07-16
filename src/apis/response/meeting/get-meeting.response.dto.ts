import { Meeting } from "types/interface/interface";
import ResponseDto from "../response.dto";

export default interface GetMeetingResponseDto extends ResponseDto {
    meeting: Meeting
}