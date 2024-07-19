import Images from "./image.interface";

export default interface Notice{
    id: number;
    noticeId : number | string;
    title : string;
    content : string;
    imageList: Images[];
    nickname : string;
    createDateTime : string;
    updateDateTime : string;
}