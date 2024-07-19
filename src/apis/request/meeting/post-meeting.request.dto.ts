import { Images } from "types/interface/interface";

export default interface PostMeetingRequestDto {
    title: string,
    introduction: string,
    content: string,
    imageList: Images[],
    nickname: string,
    maxParticipants: number,
    tags: string[],
    categories: string[],
    locations: string[],
}