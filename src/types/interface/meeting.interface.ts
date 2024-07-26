import { Images, User } from "./interface";


export default interface Meeting{
    date: string | number | Date;
    meetingId: number;
    title : string;
    introduction : string;
    content : string;
    imageList : Images[];
    createDate : string;
    modifyDate : string;
    maxParticipants : number;
    tags : string[];
    categories : string[];
    locations : string[];
    userNickname : string;
    userDto: User;
}