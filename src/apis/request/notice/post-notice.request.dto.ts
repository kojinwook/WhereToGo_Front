import Images from "types/interface/image.interface";

export default interface PostNoticeRequestDto{
    title : string;
    content : string;
    imageList: Images[];
}