import { Images } from "types/interface/interface";

export default interface patchQuestionRequestDto{
    title : string;
    content : string;
    nickname : string;
    type : string;
    imageList: Images[];
}