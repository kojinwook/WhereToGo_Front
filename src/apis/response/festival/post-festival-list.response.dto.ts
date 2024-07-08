import { Festival } from "types/interface/festival.interface";
import ResponseDto from "../response.dto";

export default interface PostFestivalResponseDto extends ResponseDto{
    festivalList: [];
    festival: Festival;
}