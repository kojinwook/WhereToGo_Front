import axios from "axios";
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
import GetAllReviewResponseDto from "./response/review/get-all-review.response.dto";
import GetReviewListResponseDto from "./response/review/get-review-list.response.dto";

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const multipartFormData = { headers: { 'Url-Type': 'multipart/form-data' } };

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
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
const GET_REVIEW_LIST_URL = (userId: string | number) => `${API_DOMAIN}/review/getReviewList?userId=${userId}`;
const GET_ALL_REVIEW_URL = (contentId: string | number) => `${API_DOMAIN}/review/getAllReview?contentId=${contentId}`;

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

export const PostReviewRequest = async (contentId: number, rate: number, review: string, imageList: string[], accessToken: string) => {
    const result = await axios.post(POST_REVIEW_URL(), { contentId, rate, review, imageList }, authorization(accessToken))
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
};

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

export const GetReviewListRequest = async (userId: string | number) => {
    const result = await axios.get(GET_REVIEW_LIST_URL(userId))
        .then(response => {
            const responseBody: GetReviewListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
};

export const GetAllReviewRequest = async (contentId: string | number) => {
    const result = await axios.get(GET_ALL_REVIEW_URL(contentId))
        .then(response => {
            const responseBody: GetAllReviewResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            const responseBody: ResponseDto = error.response.data;
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