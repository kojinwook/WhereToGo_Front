import { Images } from "./interface";


export default interface Meeting{
    meetingId: number;
    title : string;
    introduction : string;
    content : string;
    imageList : Images[];
    createDate : string;
    modifyDate : string;
    maxParticipants : number;
    categories : string[];
    locations : string[];
    userNickname : string;
}