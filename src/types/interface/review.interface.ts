export default interface Review {
    contentId: number;
    reviewId: number;
    nickname: string;
    rate: number;
    review: string;
    imageList: string[];
    writeDatetime: string;
    modifyDatetime: string;
}