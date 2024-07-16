export default interface MeetingRequest {
    requestId: number;
    requestDate: string;
    status: string;
    user: {
        id: number;
        userId: string;
        nickname: string;
        email: string;
        phoneNumber: string;
        // 기타 필드들
    };
}