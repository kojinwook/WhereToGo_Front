export default interface Question{
    answers : boolean;
    questionId : number | string;
    title : string;
    content : string;
    nickname : string;
    type : string;
    images: string[];
    createDateTime :string;
    modifyDateTime : string;
}