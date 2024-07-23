
import User from "types/interface/user.interface";
import { ResponseDto } from "../response";

export default interface GetUserResponseDto extends ResponseDto, User {
}