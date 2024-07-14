export default interface Question{
    answers : boolean;
    questionId : number | string;
    title : string;
    content : string;
    nickname : string;
    type : string;
    imageList: string[];
    createDateTime :string;
    modifyDateTime : string;
}