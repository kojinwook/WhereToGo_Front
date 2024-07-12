export default interface Review {
    contentId: number;
    reviewId: number;
    nickname: string;
    rate: number;
    review: string;
    images: ReviewImage[];
    writeDatetime: string;
    modifyDatetime: string;
}

export interface ReviewImage {
    id: number;
    userId: string;
    contentId: string;
    image: string;
    reviewId: number;
}