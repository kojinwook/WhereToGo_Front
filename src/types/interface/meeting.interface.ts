import { Images, User } from "./interface";


export default interface Meeting{
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
    userProfileImage : string;
    creatorProfileImage : string;
    creatorNickname : string;
    userDto: User;
}