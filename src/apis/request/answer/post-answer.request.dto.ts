export default interface PostAnswerRequestDto{
    content : string;
    nickname : string;
    questionId : string | undefined;
}