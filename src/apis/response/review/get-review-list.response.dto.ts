import Review from "types/interface/review.interface";
import ResponseDto from "../response.dto";

export default interface GetReviewListResponseDto extends ResponseDto{
    reviewList: Review[];
}