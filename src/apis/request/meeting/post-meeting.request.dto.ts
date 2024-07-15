import { Images } from "types/interface/interface";

export default interface PostMeetingRequestDto {
    title: string,
    introduction: string,
    content: string,
    imageUrl: Images | null,
    nickname: string,
    maxParticipants: number
}