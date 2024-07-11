import { PatchAnswerRequestDto, PostAnswerRequestDto } from "./request/answer";
import { PatchQuestionRequestDto, PostQuestionRequestDto } from "./request/question";
import { DeleteAnswerResponseDto, GetAllAnswerResponseDto, GetAnswerResponseDto, PatchAnswerResponseDto, PostAnswerResponseDto } from "./response/answer";
import { DeleteQuestionResponseDto, GetAllQuestionResponseDto, GetQuestionResponseDto, PatchQuestionResponseDto, PostQuestionResponseDto } from "./response/question";
import GetAllNoticeResponseDto from "./response/notice/get-all-notice.response.dto";
import GetNoticeResponseDto from "./response/notice/get-notice.response.dto";
import { DeleteNoticeResponseDto, PatchNoticeResponseDto, PostNoticeResponseDto } from "./response/notice";
import { PatchNoticeRequestDto, PostNoticeRequestDto } from "./request/notice";
import axios, { AxiosResponse } from "axios";
import PostFestivalResponseDto from "./response/festival/post-festival-list.response.dto";
import { ResponseDto } from "./response/response";
import { PatchFestivalRequestDto } from "./request/festival/festival";
import Festival from "types/interface/festival.interface";
import GetAverageRateResponseDto from "./response/review/get-average-rate.response.dto";
import PatchReviewRequestDto from "./request/review/patch-review.request.dto";
import GetReviewResponseDto from "./response/review/get-review.response.dto";
import PostChatMessageRequestDto from "./request/chat/post-chat-message.request.dto";
import PostChatRoomRequestDto from "./request/chat/post-chat-room.request.dto";
import GetChatMessageListResponseDto from "./response/chat/get-chat-message-list.response.dto";
import GetChatMessageResponseDto from "./response/chat/get-chat-message.response.dto";
import PostChatRoomResponseDto from "./response/chat/post-chat-room.response.to";
import GetChatRoomListResponseDto from "./response/chat/get-chat-room-list.response.dto";
import AdminSignUpRequsetDto from "./request/auth/admin-sign-up.request.dto";
import { AdminSignInRequestDto, CheckCertificationRequestDto, EmailCertificationRequestDto, nicknameCheckRequestDto, SignInRequestDto, SignUpRequestDto, userIdCheckRequestDto } from "./request/auth";
import { AdminSignInResponseDto, AdminSignUpResponseDto, CheckCertificationResponseDto, EmailCertificationResponseDto, SignInResponseDto, SignUpResponseDto } from "./response/auth";
import nicknameCheckResponseDto from "./response/auth/nickname-check.response.dto";
import { GetSignInUserResponseDto, GetUserResponseDto, PasswordRecoveryResponseDto, PatchNicknameResponseDto } from "./response/user";
import AdminSignUpRequestDto from "./request/auth/admin-sign-up.request.dto";
import userIdCheckResponseDto from "./response/auth/userId-check.response.dto";
import PatchNicknameRequestDto from "./request/user/patch-nickname.request.dto";
import PatchPasswordRequestDto from "./request/user/patch-password.request.dto";
import WithdrawalUserRequestDto from "./request/user/withdrawal-user.request.dto";
import PasswordRecoveryRequestDto from "./request/user/password-recovery.request.dto";
import { ResponseBody } from "types";

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

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
const GET_SEARCH_FESTIVAL_LIST_URL = (areaCode: string) => `${API_DOMAIN}/festival/searchFestivalList?areaCode=${areaCode}`;
const GET_FESTIVAL_URL = (contentId: string | number) => `${API_DOMAIN}/festival/getFestival?contentId=${contentId}`;
const PATCH_FESTIVAL_URL = (contentId: string | number) => `${API_DOMAIN}/festival/patchFestival?contentId=${contentId}`;

const POST_REVIEW_URL = () => `${API_DOMAIN}/review/postReview`;
const GET_RATE_AVERAGE_RATE_URL = (contentId: string | number) => `${API_DOMAIN}/review/getAverageRate?contentId=${contentId}`;
const GET_REVIEW_URL = (reviewId: string | number) => `${API_DOMAIN}/review/getReview?reviewId=${reviewId}`;
const PATCH_REVIEW_URL = (reviewId: string | number) => `${API_DOMAIN}/review/patchReview?reviewId=${reviewId}`;
const GET_REVIEW_LIST_URL = (contentId: string | number) => `${API_DOMAIN}/review/getReviewList?contentId=${contentId}`;

const POST_CHAT_MESSAGE_URL = () => `${API_DOMAIN}/chat/message`;
const GET_CHAT_MESSAGE_LIST_URL = (roomId: string) => `${API_DOMAIN}/chat/messages/by-room?roomId=${roomId}`;
const GET_CHAT_MESSAGE = (messageId: string) => `${API_DOMAIN}/chat/message/by-id?messageId=${messageId}`;
const POST_CHAT_ROOM_URL = () => `${API_DOMAIN}/chat/rooms`;
const GET_CHAT_ROOM_URL = (userId: string) => `${API_DOMAIN}/chat/room?userId=${userId}`;
const GET_CHAT_ROOM_LIST_URL = () => `${API_DOMAIN}/chat/rooms`;

const ADMIN_SIGN_IN_URL = () => `${API_DOMAIN}/auth/admin-sign-in`;
const ADMIN_SIGN_UP_URL = () => `${API_DOMAIN}/auth/admin-sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const ID_CHECK_URL = () => `${API_DOMAIN}/auth/userId-check`;
const NICKNAME_CHECK_URL = () => `${API_DOMAIN}/auth/nickname-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const GET_USER_URL = (userId: string) => `${API_DOMAIN}/user/${userId}`;
const PATCH_PASSWORD_URL = (userId: string) => `${API_DOMAIN}/user/change-password/${userId}`;
const RECOVER_PASSWORD_URL = () => `${API_DOMAIN}/user/recovery-password`;
const WIDTHDRAWAL_USER_URL = (userId: string) => `${API_DOMAIN}/user/withdrawal/${userId}`;


export const AdminSignInRequest = async (requestBody: AdminSignInRequestDto) => {
    const result = await axios.post(ADMIN_SIGN_IN_URL(), requestBody)
        .then(responseHandler<AdminSignInResponseDto>)
        .catch(errorHandler);
    return result;
};

export const AdminSignUpRequest = async (requestBody: AdminSignUpRequestDto) => {
    const result = await axios.post(ADMIN_SIGN_UP_URL(), requestBody)
        .then(response => {
            const responseBody: AdminSignUpResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
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

export const UserIdCheckRequest = async (requestBody: userIdCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<userIdCheckResponseDto>)
        .catch(errorHandler);
    return result;
};

export const NicknameCheckRequest = async (requestBody: nicknameCheckRequestDto) => {
    const result = await axios.post(NICKNAME_CHECK_URL(), requestBody)
        .then(responseHandler<nicknameCheckResponseDto>)
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
        .then(response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const PatchNicknameRequest = async (requestBody: PatchNicknameRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchNicknameResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetUserRequest = async (userId: string, accessToken: string) => {
    const result = await axios.get(GET_USER_URL(userId), authorization(accessToken))
        .then(response => {
            const responseBody: GetUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const PatchPasswordRequest = async (userId: string, requestBody: PatchPasswordRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_PASSWORD_URL(userId), requestBody, authorization(accessToken))
        .then(Response => {
            const responseBody: ResponseDto = Response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const WithdrawUserRequest = async (userId: string, requestBody: WithdrawalUserRequestDto) => {
    const config = { data: requestBody };
    const result = await axios.delete(WIDTHDRAWAL_USER_URL(userId), config)
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const RecoveryPasswordRequest = async (requestBody: PasswordRecoveryRequestDto): Promise<ResponseBody<PasswordRecoveryResponseDto>> => {
    try {
        const response = await axios.post(RECOVER_PASSWORD_URL(), requestBody);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        }
        throw error;
    }
};



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
const PATCH_NOTICE_URL =(noticeId : number |string | undefined) => `${API_DOMAIN}/notice/update/${noticeId}`;
const GET_NOTICE_URL = (noticeId: number | string | undefined) => `${API_DOMAIN}/notice/detail/${noticeId}`;
const DELETE_NOTICE_URL = (noticeId: number | string | undefined) => `${API_DOMAIN}/notice/delete/${noticeId}`;

export const PostFestivalListRequest = async (date: string) => {
    const result = await axios.post(POST_FESTIVAL_LIST_URL(date), null)
        .then(response => {
            const responseBody: PostFestivalResponseDto = response.data;
            console.log(responseBody);
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetFestivalListRequest = async () => {
    const result = await axios.get(GET_FESTIVAL_LIST_URL())
        .then(response => {
            const responseBody: PostFestivalResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetSearchFestivalListRequest = async (areaCode: string) => {
    const result = await axios.get(GET_SEARCH_FESTIVAL_LIST_URL(areaCode))
        .then(response => {
            const responseBody: PostFestivalResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetFestivalRequest = async (contentId: string) => {
    const result = await axios.get(GET_FESTIVAL_URL(contentId))
        .then(response => {
            const responseBody: PostFestivalResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const PatchFestivalRequest = async (requestBody: Festival, accessToken: string) => {
    const result = await axios.patch(PATCH_FESTIVAL_URL(requestBody.contentId), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const getAllAnswerRequest = async (questionId: number | string) => {
    const result = await axios.get(GET_ALL_ANSWER_URL(questionId))
        .then(response => {
            const responseBody: GetAllAnswerResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const getAnswerRequest = async (questionId: number | string) => {
    const result = await axios.get(GET_ANSWER_URL(questionId))
        .then(response => {
            const responseBody: GetAnswerResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};
export const PostReviewRequest = async (contentId: number, rate: number, review: string, imageList: string[], accessToken: string) => {
    const result = await axios.post(POST_REVIEW_URL(), { contentId, rate, review, imageList }, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const postAnswerRequest = async (requestBody: PostAnswerRequestDto) => {
    const result = await axios.post(POST_ANSWER_URL(), requestBody)
        .then(response => {
            const responseBody: PostAnswerResponseDto = response.data;
        })
    return result;
};

export const GetAverageRateRequest = async (contentId: string) => {
    const result = await axios.get(GET_RATE_AVERAGE_RATE_URL(contentId))
        .then(response => {
            const responseBody: GetAverageRateResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const deleteAnswerRequest = async (answerId: number | string) => {
    const result = await axios.delete(DELETE_ANSWER_URL(answerId))
        .then(response => {
            const responseBody: DeleteAnswerResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.data;
            return responseBody;
        });
    return result;
}
export const patchAnswerRequest = async (answerId: number | string, requestBody: PatchAnswerRequestDto) => {
    const result = await axios.patch(PATCH_ANSWER_URL(answerId), requestBody)
        .then(response => {
            const responseBody: PatchAnswerResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getAllQuestionRequest = async () => {
    const result = await axios.get(GET_ALL_QUESTION_URL())
        .then(response => {
            const responseBody: GetAllQuestionResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;

};

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
};

export const GetReviewRequest = async (reviewId: string | number) => {
    const result = await axios.get(GET_REVIEW_URL(reviewId))
        .then(response => {
            const responseBody: GetReviewResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getQuestionRequest = async (questionId: number | string | undefined) => {
    const result = await axios.get(GET_QUESTION_URL(questionId))
        .then(response => {
            const responseBody: GetQuestionResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response;
            return responseBody;
        });
    return result;
}

export const postQuestionRequest = async (requestBody: PostQuestionRequestDto) => {
    const result = await axios.post(POST_QUESTION_URL(), requestBody)
        .then(response => {
            const responseBody: PostQuestionResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


export const PatchReviewRequest = async (reviewId: string | number, requestBody: PatchReviewRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_REVIEW_URL(reviewId), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetReviewListRequest = async (contentId: string | number) => {
    const result = await axios.get(GET_REVIEW_LIST_URL(contentId))
        .then(response => {
            const responseBody: GetReviewResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const deleteQuestionRequest = async (questionId: number | string) => {
    const result = await axios.delete(DELETE_QUESTION_URL(questionId))
        .then(response => {
            const responseBody: DeleteQuestionResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.data;
            return responseBody;
        });
    return result;
}
export const patchQuestionRequest = async (questionId: number | string | undefined, requestBody: PatchQuestionRequestDto) => {
    const result = await axios.patch(PATCH_QUESTION_URL(questionId), requestBody)
        .then(response => {
            const responseBody: PatchQuestionResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
export const getAllNoticeRequest = async () => {
    const result = await axios.get(GET_ALL_NOTICE_URL())
    .then(response => {
        const responseBody: GetAllNoticeResponseDto = response.data;
        return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
            })
            return result;
}
export const getNoticeRequest = async (noticeId: number | string | undefined) => {
    const result = await axios.get(GET_NOTICE_URL(noticeId))
    .then(response => {
        const responseBody: GetNoticeResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        const responseBody  : ResponseDto = error.response;
        return responseBody;
        });
        return result;
    }
export const PostNoticeRequest = async (requestBody: PostNoticeRequestDto) => {
        const result = await axios.post(POST_NOTICE_URL(),requestBody)
        .then(response => {
            const responseBody: PostNoticeResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody  : ResponseDto = error.response;
            return responseBody;
    })
    return result;
}

export const deleteNoticeRequest = async (noticeId : number | string ) => {
    const result = await axios.delete(DELETE_NOTICE_URL(noticeId))
    .then(response => {
        const responseBody: DeleteNoticeResponseDto = response.data;
        return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody : ResponseDto = error.data;
            return responseBody;
            })
            return result;
}
export const patchNoticeRequest = async (noticeId : number | string | undefined, requestBody : PatchNoticeRequestDto) => {
    const result = await axios.patch(PATCH_NOTICE_URL(noticeId), requestBody)
    .then(response => {
        const responseBody : PatchNoticeResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
        if(!error.response) return null;
        const responseBody : ResponseDto = error.response.data;
        return responseBody;
        })
        return result;
}


export const PostChatMessageRequest = async (requestBody: PostChatMessageRequestDto, accessToken: string) => {
    const result = await axios.post(POST_CHAT_MESSAGE_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: ResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetChatMessageListRequest = async (roomId: string) => {
    const result = await axios.get(GET_CHAT_MESSAGE_LIST_URL(roomId))
        .then(response => {
            const responseBody: GetChatMessageListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetChatMessageRequest = async (messageId: string) => {
    const result = await axios.get(GET_CHAT_MESSAGE(messageId))
        .then(response => {
            const responseBody: GetChatMessageResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const PostChatRoomRequest = async (requestBody: PostChatRoomRequestDto) => {
    const result = await axios.post(POST_CHAT_ROOM_URL(), requestBody)
        .then(response => {
            const responseBody: PostChatRoomResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetChatRoomRequest = async (userId: string) => {
    const result = await axios.get(GET_CHAT_ROOM_URL(userId))
        .then(response => {
            const responseBody: PostChatRoomResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetChatRoomListRequest = async () => {
    const result = await axios.get(GET_CHAT_ROOM_LIST_URL())
        .then(response => {
            const responseBody: GetChatRoomListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};
