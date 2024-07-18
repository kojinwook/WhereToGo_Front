import User from "./user.interface";

export default interface MeetingBoard {
    meetingBoardId: string;
    meetingId: string;
    writer: string;
    title: string;
    content: string;
    createdDate: string;
    modifyDate: string;
    userDto:User;
}