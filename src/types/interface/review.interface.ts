import Images from "./image.interface";

export default interface Review {
    profileImage: any;
    contentId: number;
    reviewId: number;
    nickname: string;
    rate: number;
    review: string;
    images: ReviewImage[];
    imageList: Images[];
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