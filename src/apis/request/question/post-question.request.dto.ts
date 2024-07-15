import { Images } from "types/interface/interface";

export default interface PostQuestionRequest{
title : string;
content : string;
nickname : string;
type : string;
imageList: Images[];
}