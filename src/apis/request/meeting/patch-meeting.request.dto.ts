import { Images } from "types/interface/interface";

export default interface PatchMeetingRequestDto {
    title: string,
    introduction: string,
    content: string,
    nickname: string,
    imageList: Images[],
    maxParticipants: number,
    categories: string[],
    locations: string[],
}