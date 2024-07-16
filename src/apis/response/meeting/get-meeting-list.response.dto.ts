import { Meeting } from "types/interface/interface";
import ResponseDto from "../response.dto";

export default interface GetMeetingListResponseDto extends ResponseDto {
    meetingList: Meeting[];
}