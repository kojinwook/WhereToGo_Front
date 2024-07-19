import Images from "types/interface/image.interface";

export default interface PostNoticeRequestDto{
    title : string;
    content : string;
    nickname : string;
    imageList: Images[];
}