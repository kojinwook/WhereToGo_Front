export default interface PatchUserRequestDto{
    nickname: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    profileImage: string | null;
}