export default interface Question{
    answers : boolean;
    questionId : number | string;
    title : string;
    content : string;
    userId : string;
    type : string;
    image : string;
    createDateTime :string;
    modifyDateTime : string;
}