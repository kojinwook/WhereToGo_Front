import { StringLiteral } from "typescript";

export default interface AdminSignUpRequsetDto {
    userId: string;
    nickname: string;
    password: string;
    email: string;
    certificationNumber: string;
    secretKey: string;
    agreePersonal: boolean;
}