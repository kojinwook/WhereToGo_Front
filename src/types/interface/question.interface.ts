import { Images } from "./interface";

export default interface Question{
    answers : boolean;
    questionId : number | string;
    title : string;
    content : string;
    nickname : string;
    type : string;
    imageList: Images[];
    createDateTime :string;
    modifyDateTime : string;
}