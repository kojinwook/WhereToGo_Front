import { Images } from "types/interface/interface";

export default interface PatchReviewRequestDto {
    imageList: Images[];
    review: string;
    rate: number;
}