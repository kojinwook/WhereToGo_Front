export default interface Answer{
    answerId : number | string;
    userId : string;
    content: string;
    questionId : number | string;
    createDateTime : string;
    modifyDateTime : string;
}