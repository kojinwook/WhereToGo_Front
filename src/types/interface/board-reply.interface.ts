import ReplyReply from "./reply-reply.interface";
import User from "./user.interface";

export default interface BoardReply {
    replyId: number,
    reply: string,
    createDate: string,
    modifyDate: string,
    meetingBoardId: number,
    userDto: User,
    replies: ReplyReply[],
}