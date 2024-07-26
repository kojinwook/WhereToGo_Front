export default interface PostBoardReplyRequestDto {
    reply: string,
    meetingBoardId: number | string,
    meetingId: number | string;
}