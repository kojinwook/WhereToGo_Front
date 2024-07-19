import { User } from "./interface";

export default interface ReplyReply {
    replyReplyId: number,
    reply: string,
    createDate: string,
    modifyDate: string,
    userDto: User,
}