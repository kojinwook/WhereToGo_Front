import ChatMessage from "types/interface/chat-message.interface";
import { Answer, BoardReply, ChatRoom, Favorite, Festival, Meeting, MeetingBoard, MeetingRequest, MeetingUser, Notice, User } from "types/interface/interface";
import Question from "types/interface/question.interface";
import Review from "types/interface/review.interface";
import { ResponseCode, ResponseMessage } from "../../types/enums/enums";

export default interface ResponseDto{
    code: ResponseCode;
    message: ResponseMessage;
    success: boolean;
    festivalList:Festival[];
    questions: Question[];
    notice: Notice
    notices : Notice[];
    festival: Festival;
    review: Review;
    reviews: Review[];
    roomId: string;
    profileImage: string | null;
    email: string;
    nickname: string;
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
}