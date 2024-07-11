export default interface PostAnswerRequestDto{
    content : string;
    userId : string;
    questionId : string | undefined;
}