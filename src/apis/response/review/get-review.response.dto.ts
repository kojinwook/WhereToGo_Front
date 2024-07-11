import Review from "types/interface/review.interface";
import { ResponseDto } from "../response";

export default interface GetReviewResponseDto extends ResponseDto{
    review: Review;
    reviews: Review[];
}
