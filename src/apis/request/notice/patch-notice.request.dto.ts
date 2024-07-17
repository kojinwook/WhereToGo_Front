import Images from "types/interface/image.interface";

export default interface PatchNoticeRequestDto{
    title : string;
    content : string;
    imageList: Images[];
}