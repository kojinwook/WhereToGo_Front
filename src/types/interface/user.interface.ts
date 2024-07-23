export default interface User {
    userId: string;
    password: string;
    email: string;
    nickname: string;
    profileImage: string | null;
    createDate: string;
    role: string;
    temperature: number;
    reportCount: number;
    isBlocked: boolean;
    blockReleaseDate: string | null;
}