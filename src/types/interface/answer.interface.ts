export default interface Answer{
    answerId : number | string;
    nickname : string;
    content: string;
    questionId : number | string;
    createDateTime : string;
    modifyDateTime : string;
}