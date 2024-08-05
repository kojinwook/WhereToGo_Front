    import { PatchAnswerRequestDto, PostAnswerRequestDto } from "./request/answer";
import { PatchQuestionRequestDto, PostQuestionRequestDto } from "./request/question";
import { DeleteAnswerResponseDto, GetAllAnswerResponseDto, GetAnswerResponseDto, PatchAnswerResponseDto, PostAnswerResponseDto } from "./response/answer";
import { DeleteQuestionResponseDto, GetAllQuestionResponseDto, GetQuestionResponseDto, PatchQuestionResponseDto, PostQuestionResponseDto } from "./response/question";
import { DeleteNoticeResponseDto, GetAllNoticeResponseDto, GetNoticeResponseDto, GetSearchNoticeListResponseDto, PatchNoticeResponseDto, PostNoticeResponseDto } from "./response/notice";
import { PatchNoticeRequestDto, PostNoticeRequestDto } from "./request/notice";
import axios, { AxiosResponse } from "axios";
import { ResponseDto } from "./response/response";
import Festival from "types/interface/festival.interface";
import { AdminSignInRequestDto, AdminSignUpRequestDto, CheckCertificationRequestDto, EmailCertificationRequestDto, NicknameCheckRequestDto, SignInRequestDto, SignUpRequestDto, UserIdCheckRequestDto } from "./request/auth";
import { AdminSignInResponseDto, AdminSignUpResponseDto, CheckCertificationResponseDto, EmailCertificationResponseDto, NicknameCheckResponseDto, SignInResponseDto, SignUpResponseDto, UserIdCheckResponseDto } from "./response/auth";
import { BlockUserResponseDto, DeleteUserResponseDto, FindUserIdResponseDto, GetSignInUserResponseDto, GetUserListResponseDto, GetUserResponseDto, PasswordRecoveryResponseDto, PatchNicknameResponseDto, PatchPasswordResponseDto, PatchProfileImageResponseDto, PatchUserResponseDto, ReportUserListResponseDto, ReportUserResponseDto, VerifyPasswordResponseDto, WithdrawalUserResponseDto } from "./response/user";
import { ResponseBody } from "types";
import { DeleteMeetingResponseDto, Get5RecentMeetingResponseDto, GetJoinMeetingMemberResponseDto, GetMeetingListResponseDto, GetMeetingRequestsResponseDto, GetMeetingResponseDto, GetUserMeetingListResponseDto, PatchMeetingResponseDto, PostJoinMeetingResponseDto, PostMeetingResponseDto } from "./response/meeting";
import { GetAllReviewResponseDto, GetAverageRateResponseDto, GetReviewListResponseDto, GetReviewResponseDto, PatchReviewResponseDto, PostReviewResponseDto } from "./response/review/review";
import { PatchReviewRequestDto } from "./request/review";
import { PostChatMessageRequestDto, PostChatRoomRequestDto } from "./request/chat";
import { GetAllFavoriteResponseDto, GetFestivalListResponseDto, GetFestivalResponseDto, GetSearchFestivalListResponseDto, GetTop5FestivalListResponseDto, PatchFestivalResponseDto, PostFestivalResponseDto, PutFavoriteResponseDto } from "./response/festival";
import { Images } from "types/interface/interface";
import { BlockUserRequestDto, FindUserIdRequestDto, PasswordRecoveryRequestDto, PatchNicknameRequestDto, PatchPasswordRequestDto, PatchProfileImageRequestDto, PatchUserRequestDto, ReportUserRequestDto, VerifyPasswordRequestDto, WithdrawalUserRequestDto } from "./request/user";
import { GetChatMessageListResponseDto, GetChatMessageResponseDto, PostChatRoomResponseDto, GetChatRoomResponseDto, GetChatRoomListResponseDto, GetChatRoomUsersResponseDto, PostChatMessageResponseDto } from "./response/chat";
import { PatchMeetingRequestDto, PostJoinMeetingRequestDto, PostMeetingRequestDto } from "./request/meeting";
import { PatchMeetingBoardRequestDto, PostMeetingBoardRequestDto } from "./request/meeting/board";
import { GetMeetingBoardImageListResponseDto, GetMeetingBoardListResponseDto, GetMeetingBoardResponseDto, GetUserBoardListResponseDto, PatchMeetingBoardResponseDto, PostMeetingBoardResponseDto } from "./response/meeting/board";
import { PatchBoardReplyRequestDto, PatchReplyReplyRequestDto, PostBoardReplyRequestDto, PostReplyReplyRequestDto } from "./request/meeting/board/reply";
import { DeleteBoardReplyResponseDto, DeleteReplyReplyResponseDto, GetBoardReplyListResponseDto, PatchBoardReplyResponseDto, PatchReplyReplyResponseDto, PostBoardReplyResponseDto, PostReplyReplyResponseDto } from "./response/meeting/board/reply";
import GetTop5TemperatureUserResponseDto from "./response/user/get-temperature-top5-user.response.dto";

const DOMAIN = 'http://localhost:8080';
// const DOMAIN = 'http://13.124.235.221:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
// const API_DOMAIN = "/api/v1";


const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const multipartFormData = { headers: { 'Url-Type': 'multipart/form-data' } };

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const responseHandler = <T>(response: AxiosResponse<any, any>) => {
    const responseBody: T = response.data;
    return responseBody;
};

const errorHandler = (error: any) => {
    if (!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
};

const POST_FESTIVAL_LIST_URL = (date: string) => `${API_DOMAIN}/festival/saveFestivalList?eventStartDate=${date}`;
const GET_FESTIVAL_LIST_URL = () => `${API_DOMAIN}/festival/getFestivalList`;
const GET_SEARCH_FESTIVAL_LIST_URL = (areaCode: string | number) => `${API_DOMAIN}/festival/searchFestivalList?areaCode=${areaCode}`;
const GET_FESTIVAL_URL = (contentId: string | number) => `${API_DOMAIN}/festival/getFestival?contentId=${contentId}`;
const PATCH_FESTIVAL_URL = (contentId: string | number) => `${API_DOMAIN}/festival/patchFestival?contentId=${contentId}`;
const PUT_FAVORITE_URL = (contentId: string | number, nickname: string) => `${API_DOMAIN}/favorite/putFavorite?contentId=${contentId}&nickname=${nickname}`;
const GET_ALL_FAVORITE_URL = (nickname: string) => `${API_DOMAIN}/favorite/getAllFavoriteList?nickname=${nickname}`;
const GET_TOP5_FESTIVAL_LIST_URL = () => `${API_DOMAIN}/festival/getTop5FestivalList`;

const POST_REVIEW_URL = () => `${API_DOMAIN}/review/postReview`;
const GET_RATE_AVERAGE_RATE_URL = (contentId: string | number) => `${API_DOMAIN}/review/getAverageRate?contentId=${contentId}`;
const GET_REVIEW_URL = (reviewId: string | number) => `${API_DOMAIN}/review/getReview?reviewId=${reviewId}`;
const PATCH_REVIEW_URL = (reviewId: string | number) => `${API_DOMAIN}/review/patchReview?reviewId=${reviewId}`;
const GET_REVIEW_LIST_URL = (nickname: string | number) => `${API_DOMAIN}/review/getReviewList?nickname=${nickname}`;
const GET_ALL_REVIEW_URL = (contentId: string | number) => `${API_DOMAIN}/review/getAllReview?contentId=${contentId}`;

const POST_CHAT_MESSAGE_URL = () => `${API_DOMAIN}/chat/message`;
const GET_CHAT_MESSAGE_LIST_URL = (roomId: string | number) => `${API_DOMAIN}/chat/messages/by-room?roomId=${roomId}`;
const GET_CHAT_MESSAGE = (messageId: string | number) => `${API_DOMAIN}/chat/message/by-id?messageId=${messageId}`;
const POST_CHAT_ROOM_URL = () => `${API_DOMAIN}/chat/rooms`;
const GET_CHAT_ROOM_URL = (nickname: string) => `${API_DOMAIN}/chat/room?nickname=${nickname}`;
const GET_CHAT_ROOM_LIST_URL = () => `${API_DOMAIN}/chat/rooms`;
const GET_CHAT_ROOM_USERS_URL = (roomId: string | number) => `${API_DOMAIN}/chat/room/users?roomId=${roomId}`;

const ADMIN_SIGN_IN_URL = () => `${API_DOMAIN}/auth/admin-sign-in`;
const ADMIN_SIGN_UP_URL = () => `${API_DOMAIN}/auth/admin-sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/userId-check`;
const NICKNAME_CHECK_URL = () => `${API_DOMAIN}/auth/nickname-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_USER_LIST_URL = () => `${API_DOMAIN}/user/user-list`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const GET_USER_URL = (userId: string) => `${API_DOMAIN}/user/${userId}`;
const PATCH_PASSWORD_URL = () => `${API_DOMAIN}/user/change-password`;
const RECOVER_PASSWORD_URL = () => `${API_DOMAIN}/user/recovery-password`;
const VERIFY_PASSWORD_URL = () => `${API_DOMAIN}/user/verify-password`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;
const PATCH_USER_URL = () => `${API_DOMAIN}/user/patch-user`;
const FIND_USERID_URL = () => `${API_DOMAIN}/user/find-userId`;
const WIDTHDRAWAL_USER_URL = () => `${API_DOMAIN}/user/withdrawal`;
const DELETE_USER_URL = (userId: string) => `${API_DOMAIN}/user/delete-user/${userId}`;
const REPORT_USER_URL = (userId: string) => `${API_DOMAIN}/user/report-user/${userId}`;
const GET_REPORT_USER_LIST_URL = (nickname: string) => `${API_DOMAIN}/user/report-list/${nickname}`;
const BLOCK_USER_URL = (userId: string) => `${API_DOMAIN}/user/block-user/${userId}`;
const GET_TOP5_TEMPERATURE_USER_LIST_URL = () => `${API_DOMAIN}/user/temperature-top5`;

const GET_ALL_ANSWER_URL = (questionId: number | string) => `${API_DOMAIN}/question/answer/list/${questionId}`;
const POST_ANSWER_URL = () => `${API_DOMAIN}/question/answer`;
const PATCH_ANSWER_URL = (answerId: number | string) => `${API_DOMAIN}/question/answer/update/${answerId}`;
const GET_ANSWER_URL = (questionId: number | string) => `${API_DOMAIN}/question/answer/detail/${questionId}`;
const DELETE_ANSWER_URL = (answerId: number | string) => `${API_DOMAIN}/question/answer/delete/${answerId}`;

const GET_ALL_QUESTION_URL = () => `${API_DOMAIN}/question/list`;
const POST_QUESTION_URL = () => `${API_DOMAIN}/question`;
const PATCH_QUESTION_URL = (questionId: number | string | undefined) => `${API_DOMAIN}/question/update/${questionId}`;
const GET_QUESTION_URL = (questionId: number | string | undefined) => `${API_DOMAIN}/question/detail/${questionId}`;
const DELETE_QUESTION_URL = (questionId: number | string | undefined) => `${API_DOMAIN}/question/delete/${questionId}`;

const GET_ALL_NOTICE_URL = () => `${API_DOMAIN}/notice/list`;
const POST_NOTICE_URL = () => `${API_DOMAIN}/notice`;
const PATCH_NOTICE_URL = (noticeId: number | string | undefined) => `${API_DOMAIN}/notice/update/${noticeId}`;
const GET_SEARCH_NOTICE_LIST_URL = (keyword: string) => `${API_DOMAIN}/notice/searchNoticeList?keyword=${keyword}`;
const GET_NOTICE_URL = (noticeId: number | string | undefined) => `${API_DOMAIN}/notice/detail/${noticeId}`;
const DELETE_NOTICE_URL = (noticeId: number | string | undefined) => `${API_DOMAIN}/notice/delete/${noticeId}`;

const POST_MEETING_URL = () => `${API_DOMAIN}/meeting/write`;
const GET_MEETING_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/detail/${meetingId}`;
const GET_MEETING_LIST_URL = () => `${API_DOMAIN}/meeting/list`;
const POST_JOIN_MEETING_URL = () => `${API_DOMAIN}/meeting/join`;
const POST_RESPONSE_URL = (requestId: number | string, status: boolean) => `${API_DOMAIN}/meeting/response?requestId=${requestId}&status=${status}`;
const GET_MEETING_REQUESTS_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/requests?meetingId=${meetingId}`;
const PATCH_MEETING_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/update/${meetingId}`;
const DELETE_MEETING_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/delete/${meetingId}`;
const GET_MEETING_USERS_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/members?meetingId=${meetingId}`;
const GET_USER_MEETING_LIST_URL = () => `${API_DOMAIN}/meeting/my-meeting-list`;
const GET_5RECENT_MEETING_URL = () => `${API_DOMAIN}/meeting/5recent-meeting`;

const POST_MEETING_BOARD_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/board/${meetingId}`;
const GET_MEETING_BOARD_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/board/detail/${meetingId}`;
const GET_MEETING_BOARD_LIST_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/board/list/${meetingId}`;
const PATCH_MEETING_BOARD_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/board/update/${meetingId}`;
const GET_USER_BOARD_LIST_URL = (userId: string) => `${API_DOMAIN}/meeting/board/my-board-list/${userId}`;
const DELETE_MEETING_BOARD_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/board/delete/${meetingId}`;
const GET_MEETING_BOARD_IMAGE_LIST_URL = (meetingId: number | string) => `${API_DOMAIN}/meeting/board/imageList/${meetingId}`;
const GET_MEETING_BOARDS_TITLE_URL = (meetingBoardIds: number[] | string[]) => `${API_DOMAIN}/meeting/board/titles?meetingBoardIds=${meetingBoardIds}`;

const POST_BOARD_REPLY_URL = () => `${API_DOMAIN}/meeting/board/reply`;
const POST_REPLY_REPLY_URL = () => `${API_DOMAIN}/meeting/board/reply/reply`;
const GET_BOARD_REPLY_URL = (meetingBoardId: number | string) => `${API_DOMAIN}/meeting/board/reply/list/${meetingBoardId}`;
const DELETE_BOARD_REPLY_URL = (replyId: number | string) => `${API_DOMAIN}/meeting/board/reply/delete/${replyId}`;
const DELETE_REPLY_REPLY_URL = (replyId: number | string) => `${API_DOMAIN}/meeting/board/reply/reply/delete/${replyId}`;
const PATCH_BOARD_REPLY_URL = () => `${API_DOMAIN}/meeting/board/reply/patch`;
const PATCH_REPLY_REPLY_URL = () => `${API_DOMAIN}/meeting/board/reply/reply/patch`;

export const AdminSignInRequest = async (requestBody: AdminSignInRequestDto) => {
    const result = await axios.post(ADMIN_SIGN_IN_URL(), requestBody)
        .then(responseHandler<AdminSignInResponseDto>)
        .catch(errorHandler);
    return result;
};

export const AdminSignUpRequest = async (requestBody: AdminSignUpRequestDto) => {
    const result = await axios.post(ADMIN_SIGN_UP_URL(), requestBody)
        .then(responseHandler<AdminSignUpResponseDto>)
        .catch(errorHandler);
    return result;
};

export const SignInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler<SignInResponseDto>)
        .catch(errorHandler);
    return result;
};

export const SignupRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(responseHandler<SignUpResponseDto>)
        .catch(errorHandler);
    return result;
};

export const UserIdCheckRequest = async (requestBody: UserIdCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<UserIdCheckResponseDto>)
        .catch(errorHandler);
    return result;
};

export const NicknameCheckRequest = async (requestBody: NicknameCheckRequestDto) => {
    const result = await axios.post(NICKNAME_CHECK_URL(), requestBody)
        .then(responseHandler<NicknameCheckResponseDto>)
        .catch(errorHandler);
    return result;
};

export const EmailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<EmailCertificationResponseDto>)
        .catch(errorHandler);
    return result;
};

export const CheckCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<CheckCertificationResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(responseHandler<GetSignInUserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetUserListRequest = async (accessToken: string) => {
    const result = await axios.get(GET_USER_LIST_URL(), authorization(accessToken))
        .then(responseHandler<GetUserListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchNicknameRequest = async (requestBody: PatchNicknameRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchNicknameResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetUserRequest = async (userId: string) => {
    const result = await axios.get(GET_USER_URL(userId))
        .then(responseHandler<GetUserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchPasswordRequest = async (requestBody: PatchPasswordRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PASSWORD_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchPasswordResponseDto>)
        .catch(errorHandler);
    return result;
};

export const WithdrawUserRequest = async (requestBody: WithdrawalUserRequestDto) => {
    const config = { data: requestBody };
    const result = await axios.delete(WIDTHDRAWAL_USER_URL(), config)
        .then(responseHandler<WithdrawalUserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const DeleteUserRequest = async (userId: string, accessToken: string) => {
    const result = await axios.delete(DELETE_USER_URL(userId), authorization(accessToken))
        .then(responseHandler<DeleteUserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const ReportUserRequest = async (userId: string, requestBody: ReportUserRequestDto, accessToken: string) => {
    const result = await axios.post(REPORT_USER_URL(userId), requestBody, authorization(accessToken))
        .then(responseHandler<ReportUserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetUserReportListRequest = async (nickname: string, accessToken: string) => {
    const result = await axios.get(GET_REPORT_USER_LIST_URL(nickname), authorization(accessToken))
        .then(responseHandler<ReportUserListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const BlockUserRequest = async (userId: string, requestBody: BlockUserRequestDto, accessToken: string) => {
    const result = await axios.post(BLOCK_USER_URL(userId), requestBody, authorization(accessToken))
        .then(responseHandler<BlockUserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const Top5TemperatureUserRequest = async () => {
    const result = await axios.get(GET_TOP5_TEMPERATURE_USER_LIST_URL())
        .then(responseHandler<GetTop5TemperatureUserResponseDto>)
        .catch(errorHandler);
    return result;
}

export const RecoveryPasswordRequest = async (requestBody: PasswordRecoveryRequestDto): Promise<ResponseBody<PasswordRecoveryResponseDto>> => {
    const result = await axios.post(RECOVER_PASSWORD_URL(), requestBody)
        .then(responseHandler<PasswordRecoveryResponseDto>)
        .catch(errorHandler);
    return result;
};

export const VerifyPasswordRequest = async (requestBody: VerifyPasswordRequestDto, accessToken: string) => {
    const result = await axios.post(VERIFY_PASSWORD_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<VerifyPasswordResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchProfileImageRequest = async (requestBody: PatchProfileImageRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchProfileImageResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchUserRequest = async (requestBody: PatchUserRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_USER_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchUserResponseDto>)
        .catch(errorHandler);
    return result;
};

export const FindUserIdRequest = async (requestBody: FindUserIdRequestDto): Promise<ResponseBody<FindUserIdResponseDto>> => {
    const result = await axios.post(FIND_USERID_URL(), requestBody)
        .then(responseHandler<FindUserIdResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PostFestivalListRequest = async (date: string) => {
    const result = await axios.post(POST_FESTIVAL_LIST_URL(date), null)
        .then(responseHandler<PostFestivalResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetFestivalListRequest = async () => {
    const result = await axios.get(GET_FESTIVAL_LIST_URL())
        .then(responseHandler<GetFestivalListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetSearchFestivalListRequest = async (areaCode: string | number) => {
    const result = await axios.get(GET_SEARCH_FESTIVAL_LIST_URL(areaCode))
        .then(responseHandler<GetSearchFestivalListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetFestivalRequest = async (contentId: string | number) => {
    const result = await axios.get(GET_FESTIVAL_URL(contentId))
        .then(responseHandler<GetFestivalResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchFestivalRequest = async (requestBody: Festival, accessToken: string) => {
    const result = await axios.patch(PATCH_FESTIVAL_URL(requestBody.contentId), requestBody, authorization(accessToken))
        .then(responseHandler<PatchFestivalResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PutFavoriteRequest = async (contentId: string | number, nickname: string, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(contentId, nickname), authorization(accessToken))
        .then(responseHandler<PutFavoriteResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetAllFavoriteRequest = async (nickname: string, accessToken: string) => {
    const result = await axios.get(GET_ALL_FAVORITE_URL(nickname), authorization(accessToken))
        .then(responseHandler<GetAllFavoriteResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetTop5FestivalListRequest = async () => {
    const result = await axios.get(GET_TOP5_FESTIVAL_LIST_URL())
        .then(responseHandler<GetTop5FestivalListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetAllAnswerRequest = async (questionId: number | string) => {
    const result = await axios.get(GET_ALL_ANSWER_URL(questionId))
        .then(responseHandler<GetAllAnswerResponseDto>)
        .catch(errorHandler);
    return result;
}
export const GetAnswerRequest = async (questionId: number | string) => {
    const result = await axios.get(GET_ANSWER_URL(questionId))
        .then(responseHandler<GetAnswerResponseDto>)
        .catch(errorHandler);
    return result;
};
export const PostReviewRequest = async (contentId: string | number, rate: number, review: string, imageList: Images[], nickname: string, accessToken: string) => {
    const result = await axios.post(POST_REVIEW_URL(), { contentId, rate, review, imageList, nickname }, authorization(accessToken))
        .then(responseHandler<PostReviewResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PostAnswerRequest = async (requestBody: PostAnswerRequestDto) => {
    const result = await axios.post(POST_ANSWER_URL(), requestBody)
        .then(responseHandler<PostAnswerResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetAverageRateRequest = async (contentId: string | number) => {
    const result = await axios.get(GET_RATE_AVERAGE_RATE_URL(contentId))
        .then(responseHandler<GetAverageRateResponseDto>)
        .catch(errorHandler);
    return result;
}

export const DeleteAnswerRequest = async (answerId: number | string) => {
    const result = await axios.delete(DELETE_ANSWER_URL(answerId))
        .then(responseHandler<DeleteAnswerResponseDto>)
        .catch(errorHandler);
    return result;
}
export const PatchAnswerRequest = async (answerId: number | string, requestBody: PatchAnswerRequestDto) => {
    const result = await axios.patch(PATCH_ANSWER_URL(answerId), requestBody)
        .then(responseHandler<PatchAnswerResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetAllQuestionRequest = async () => {
    const result = await axios.get(GET_ALL_QUESTION_URL())
        .then(responseHandler<GetAllQuestionResponseDto>)
        .catch(errorHandler);
    return result;

};

export const FileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: Images = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
};

export const GetReviewRequest = async (reviewId: string | number) => {
    const result = await axios.get(GET_REVIEW_URL(reviewId))
        .then(responseHandler<GetReviewResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetQuestionRequest = async (questionId: number | string | undefined) => {
    const result = await axios.get(GET_QUESTION_URL(questionId))
        .then(responseHandler<GetQuestionResponseDto>)
        .catch(errorHandler);
    return result;
}

export const PostQuestionRequest = async (requestBody: PostQuestionRequestDto, accessToken: string) => {
    const result = await axios.post(POST_QUESTION_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostQuestionResponseDto>)
        .catch(errorHandler);
    return result;
}

export const PatchReviewRequest = async (reviewId: string | number, requestBody: PatchReviewRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_REVIEW_URL(reviewId), requestBody, authorization(accessToken))
        .then(responseHandler<PatchReviewResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetReviewListRequest = async (nickname: string | number) => {
    const result = await axios.get(GET_REVIEW_LIST_URL(nickname))
        .then(responseHandler<GetReviewListResponseDto>)
        .catch(errorHandler);
    return result;
}
export const DeleteQuestionRequest = async (questionId: number | string) => {
    const result = await axios.delete(DELETE_QUESTION_URL(questionId))
        .then(responseHandler<DeleteQuestionResponseDto>)
        .catch(errorHandler);
    return result;
}
export const PatchQuestionRequest = async (questionId: number | string | undefined, requestBody: PatchQuestionRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_QUESTION_URL(questionId), requestBody, authorization(accessToken))
        .then(responseHandler<PatchQuestionResponseDto>)
        .catch(errorHandler);
    return result;
}
export const GetAllNoticeRequest = async () => {
    const result = await axios.get(GET_ALL_NOTICE_URL())
        .then(responseHandler<GetAllNoticeResponseDto>)
        .catch(errorHandler);
    return result;
}
export const GetNoticeRequest = async (noticeId: number | string | undefined) => {
    const result = await axios.get(GET_NOTICE_URL(noticeId))
        .then(responseHandler<GetNoticeResponseDto>)
        .catch(errorHandler);
    return result;
}
export const PostNoticeRequest = async (requestBody: PostNoticeRequestDto, accessToken: string) => {
    const result = await axios.post(POST_NOTICE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostNoticeResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetSearchNoticeListRequest = async (keyword: string) => {
    const result = await axios.get(GET_SEARCH_NOTICE_LIST_URL(keyword))
        .then(responseHandler<GetSearchNoticeListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const DeleteNoticeRequest = async (noticeId: number | string) => {
    const result = await axios.delete(DELETE_NOTICE_URL(noticeId))
        .then(response => {
            const responseBody: DeleteNoticeResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.data;
            return responseBody;
        })
    return result;
}
export const PatchNoticeRequest = async (noticeId: number | string | undefined, requestBody: PatchNoticeRequestDto, accessToken: any) => {
    const result = await axios.patch(PATCH_NOTICE_URL(noticeId), requestBody, authorization(accessToken))
        .then(responseHandler<PatchNoticeResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetAllReviewRequest = async (contentId: string | number) => {
    const result = await axios.get(GET_ALL_REVIEW_URL(contentId))
        .then(responseHandler<GetAllReviewResponseDto>)
        .catch(errorHandler);
    return result;
}

export const PostChatMessageRequest = async (requestBody: PostChatMessageRequestDto, accessToken: string) => {
    const result = await axios.post(POST_CHAT_MESSAGE_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostChatMessageResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetChatMessageListRequest = async (roomId: string | number) => {
    const result = await axios.get(GET_CHAT_MESSAGE_LIST_URL(roomId))
        .then(responseHandler<GetChatMessageListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetChatMessageRequest = async (messageId: string | number) => {
    const result = await axios.get(GET_CHAT_MESSAGE(messageId))
        .then(responseHandler<GetChatMessageResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PostChatRoomRequest = async (requestBody: PostChatRoomRequestDto, accessToken: string) => {
    const result = await axios.post(POST_CHAT_ROOM_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostChatRoomResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetChatRoomRequest = async (nickname: string, accessToken: string) => {
    const result = await axios.get(GET_CHAT_ROOM_URL(nickname), authorization(accessToken))
        .then(responseHandler<GetChatRoomResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetChatRoomListRequest = async () => {
    const result = await axios.get(GET_CHAT_ROOM_LIST_URL())
        .then(responseHandler<GetChatRoomListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetChatRoomUsersRequest = async (roomId: string | number, accessToken: string) => {
    const result = await axios.get(GET_CHAT_ROOM_USERS_URL(roomId), authorization(accessToken))
        .then(responseHandler<GetChatRoomUsersResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PostMeetingRequest = async (requestBody: PostMeetingRequestDto, accessToken: string) => {
    const result = await axios.post(POST_MEETING_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostMeetingResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetMeetingRequest = async (meetingId: number | string) => {
    const result = await axios.get(GET_MEETING_URL(meetingId))
        .then(responseHandler<GetMeetingResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetMeetingListRequest = async () => {
    const result = await axios.get(GET_MEETING_LIST_URL())
        .then(responseHandler<GetMeetingListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PostJoinMeetingRequest = async (requestBody: PostJoinMeetingRequestDto, accessToken: string) => {
    const result = await axios.post(POST_JOIN_MEETING_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostJoinMeetingResponseDto>)
        .catch(errorHandler);
    return result
}

export const PostRespondToJoinRequest = async (requestId: string | number, isAccepted: boolean, accessToken: string) => {
    const result = await axios.post(POST_RESPONSE_URL(requestId, isAccepted), authorization(accessToken))
        .then(responseHandler<PostJoinMeetingResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetMeetingRequests = async (meetingId: string | number, accessToken: string) => {
    const result = await axios.get(GET_MEETING_REQUESTS_URL(meetingId), authorization(accessToken))
        .then(responseHandler<GetMeetingRequestsResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchMeetingRequest = async (meetingId: string | number, requestBody: PatchMeetingRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_MEETING_URL(meetingId), requestBody, authorization(accessToken))
        .then(responseHandler<PatchMeetingResponseDto>)
        .catch(errorHandler);
    return result;
};

export const DeleteMeetingRequest = async (meetingId: string | number, accessToken: string) => {
    const result = await axios.delete(DELETE_MEETING_URL(meetingId), authorization(accessToken))
        .then(responseHandler<DeleteMeetingResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetJoinMeetingMemberRequest = async (meetingId: string | number, accessToken: string) => {
    const result = await axios.get(GET_MEETING_USERS_URL(meetingId), authorization(accessToken))
        .then(responseHandler<GetJoinMeetingMemberResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetUserMeetingListRequest = async (accessToken: string) => {
    const result = await axios.get(GET_USER_MEETING_LIST_URL(), authorization(accessToken))
        .then(responseHandler<GetUserMeetingListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const Get5RecentMeetingRequest = async () => {
    const result = await axios.get(GET_5RECENT_MEETING_URL())
        .then(responseHandler<Get5RecentMeetingResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PostMeetingBoardRequest = async (meetingId: string | number, requestBody: PostMeetingBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_MEETING_BOARD_URL(meetingId), requestBody, authorization(accessToken))
        .then(responseHandler<PostMeetingBoardResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetMeetingBoardRequest = async (meetingId: string | number) => {
    const result = await axios.get(GET_MEETING_BOARD_URL(meetingId))
        .then(responseHandler<GetMeetingBoardResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchMeetingBoardRequest = async (meetingId: string | number, requestBody: PatchMeetingBoardRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_MEETING_BOARD_URL(meetingId), requestBody, authorization(accessToken))
        .then(responseHandler<PatchMeetingBoardResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetUserBoardListRequest = async (userId: string, accessToken: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(userId), authorization(accessToken))
        .then(responseHandler<GetUserBoardListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetMeetingBoardListRequest = async (meetingId: string | number) => {
    const result = await axios.get(GET_MEETING_BOARD_LIST_URL(meetingId))
        .then(responseHandler<GetMeetingBoardListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const DeleteMeetingBoardRequest = async (meetingId: string | number, accessToken: string) => {
    const result = await axios.delete(DELETE_MEETING_BOARD_URL(meetingId), authorization(accessToken))
        .then(responseHandler<DeleteMeetingResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetMeetingBoardImageListRequest = async (meetingId: string | number) => {
    const result = await axios.get(GET_MEETING_BOARD_IMAGE_LIST_URL(meetingId))
        .then(responseHandler<GetMeetingBoardImageListResponseDto>)
        .catch(errorHandler);
    return result;
}

export const GetMeetingBoardsTitleRequest = async (meetingBoardId: number[] | string[]) => {
    const result = await axios.get(GET_MEETING_BOARDS_TITLE_URL(meetingBoardId))
        .then(responseHandler<GetMeetingBoardListResponseDto>)
        .catch(errorHandler);
    return result;
}

export const PostBoardReplyRequest = async (requestBody: PostBoardReplyRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_REPLY_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostBoardReplyResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PostReplyReplyRequest = async (requestBody: PostReplyReplyRequestDto, accessToken: string) => {
    const result = await axios.post(POST_REPLY_REPLY_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PostReplyReplyResponseDto>)
        .catch(errorHandler);
    return result;
};

export const GetBoardReplyRequest = async (meetingBoardId: number | string) => {
    const result = await axios.get(GET_BOARD_REPLY_URL(meetingBoardId))
        .then(responseHandler<GetBoardReplyListResponseDto>)
        .catch(errorHandler);
    return result;
};

export const DeleteBoardReplyRequest = async (replyId: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_REPLY_URL(replyId), authorization(accessToken))
        .then(responseHandler<DeleteBoardReplyResponseDto>)
        .catch(errorHandler);
    return result;
};

export const DeleteReplyReplyRequest = async (replyId: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_REPLY_REPLY_URL(replyId), authorization(accessToken))
        .then(responseHandler<DeleteReplyReplyResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchBoardReplyRequest = async (requestBody: PatchBoardReplyRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_REPLY_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchBoardReplyResponseDto>)
        .catch(errorHandler);
    return result;
};

export const PatchReplyReplyRequest = async (requestBody: PatchReplyReplyRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_REPLY_REPLY_URL(), requestBody, authorization(accessToken))
        .then(responseHandler<PatchReplyReplyResponseDto>)
        .catch(errorHandler);
    return result;
};


