import { ResponseDto } from "../response";


export default interface SignInResponseDto extends ResponseDto {
    token: string;
    expirationTime: number;
}