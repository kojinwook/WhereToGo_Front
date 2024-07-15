import { Images } from "types/interface/interface";

export default interface QuestionData{
    title : string;
    content : string;
    nickname : string;
    type : string;
    imageList: Images[];
    }