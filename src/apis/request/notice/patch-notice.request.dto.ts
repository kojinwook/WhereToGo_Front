import Images from "types/interface/image.interface";

export default interface PatchNoticeRequestDto{
    title : string;
    content : string;
    nickname : string;
    imageList: Images[];
}