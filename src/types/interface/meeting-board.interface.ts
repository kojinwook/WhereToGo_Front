import User from "./user.interface";

export default interface MeetingBoard {
    meetingBoardId: string;
    meetingId: string;
    writer: string;
    title: string;
    content: string;
    createDate: string;
    modifyDate: string;
    userDto:User;
}