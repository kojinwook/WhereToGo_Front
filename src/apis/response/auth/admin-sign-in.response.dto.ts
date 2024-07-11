import { ResponseDto } from "../response";



export default interface AdminSignInResponseDto extends ResponseDto {
    token: string;
    expirationTime: number;
}