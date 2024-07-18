import { Images } from "types/interface/interface";

export default interface PatchMeetingBoardRequestDto {
    title: string;
    content: string;
    address: string;
    imageList: Images[];
}