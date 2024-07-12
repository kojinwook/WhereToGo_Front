import { StringLiteral } from "typescript";

export default interface AdminSignUpRequestDto {
    userId: string;
    nickname: string;
    password: string;
    email: string;
    certificationNumber: string;
    secretKey: string;
    phone: string;
}