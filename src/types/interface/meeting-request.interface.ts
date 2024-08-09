import User from "./user.interface";

export default interface MeetingRequest {
    requestId: number;
    requestDate: string;
    status: string;
    user: User;
}