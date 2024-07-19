import Images from "./image.interface";
import User from "./user.interface";

export default interface MeetingBoard {
    meetingBoardId: string;
    meetingId: string;
    writer: string;
    title: string;
    content: string;
    address: string;
    imageList: Images[];
    createDate: string;
    modifyDate: string;
    userDto: User;
}