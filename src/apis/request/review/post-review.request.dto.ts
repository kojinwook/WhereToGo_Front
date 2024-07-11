export default interface PostReviewRequestDto {
    nickname: string;
    imageList: string[];
    contentId: number;
    review: string;
    rate: number;
}