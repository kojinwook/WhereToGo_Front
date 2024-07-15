import { Answer, Images } from "./interface";

export default interface Question{
    answered : boolean;
    answers: Answer[];
    questionId : number | string;
    title : string;
    content : string;
    nickname : string;
    type : string;
    imageList: Images[];
    createDateTime :string;
    modifyDateTime : string;
}