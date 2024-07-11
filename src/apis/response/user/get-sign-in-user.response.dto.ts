

import User from "types/interface/user.interface";
import { ResponseDto } from "../response";

export default interface GetSignInUserResponseDto extends ResponseDto, User {
    
}