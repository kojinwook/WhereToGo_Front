import Images from "types/interface/image.interface";

export default interface PostMeetingBoardRequestDto {
    title: string;
    content: string;
    address: string;
    imageList: Images[];
}