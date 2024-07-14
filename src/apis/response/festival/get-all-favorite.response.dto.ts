import { Favorite } from "types/interface/interface";
import { ResponseDto } from "../response";

export default interface GetAllFavoriteResponseDto extends ResponseDto {
    favoriteList: Favorite[];

}