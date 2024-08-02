import ChatMessage from "types/interface/chat-message.interface";
import { Answer, BoardReply, ChatRoom, Favorite, Festival, Images, Meeting, MeetingBoard, MeetingRequest, MeetingUser, Notice, ReportUser, User } from "types/interface/interface";
import Question from "types/interface/question.interface";
import Review from "types/interface/review.interface";
import { ResponseCode } from "../../types/enums/enums";

export default interface ResponseDto {
    code: ResponseCode;
    success: boolean;
    festivalList: Festival[];
    questions: Question[];
    notice: Notice
    notices: Notice[];
    festival: Festival;
    review: Review;
    reviews: Review[];
    roomId: string;
    profileImage: string | null;
    email: string;
    nickname: string;
    temperature: number;
    answers: Answer[];
    answer: Answer[];
    question: Question;
    average: Record<string, number>;
    chatMessageList: ChatMessage[];
    favoriteList: Favorite[];
    meeting: Meeting;
    meetingList: Meeting[];
    chatRoomList: ChatRoom[];
    users: User[];
    requests: MeetingRequest[];
    meetingBoardList: MeetingBoard[];
    meetingBoard: MeetingBoard;
    meetingUsersList: MeetingUser[];
    replyList: BoardReply[];
    boardList: MeetingBoard[];
    userList: User[];
    imageList: Images[];
    blockReleaseDate: string | null;
    phoneNumber: string;
    reportList: ReportUser[];
    meetingBoardTitle: string[];
}