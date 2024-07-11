import axios from "axios";
import { Festival } from "types/interface/festival.interface";
import { PatchAnswerRequestDto, PostAnswerRequestDto } from "./request/answer";
import { PatchQuestionRequestDto, PostQuestionRequestDto } from "./request/question";
import { DeleteAnswerResponseDto, GetAllAnswerResponseDto, GetAnswerResponseDto, PatchAnswerResponseDto, PostAnswerResponseDto } from "./response/answer";
import PostFestivalResponseDto from "./response/festival/post-festival-list.response.dto";
import { DeleteQuestionResponseDto, GetAllQuestionResponseDto, GetQuestionResponseDto, PatchQuestionResponseDto, PostQuestionResponseDto } from "./response/question";
import { ResponseDto } from "./response/response";
import GetAllNoticeResponseDto from "./response/notice/get-all-notice.response.dto";
import GetNoticeResponseDto from "./response/notice/get-notice.response.dto";
import { DeleteNoticeResponseDto, PatchNoticeResponseDto, PostNoticeResponseDto } from "./response/notice";
import { PatchNoticeRequestDto, PostNoticeRequestDto } from "./request/notice";

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const POST_FESTIVAL_LIST_URL = (date: string) => `${API_DOMAIN}/festival/saveFestivalList?eventStartDate=${date}`;
const GET_FESTIVAL_LIST_URL = () => `${API_DOMAIN}/festival/getFestivalList`;
const GET_SEARCH_FESTIVAL_LIST_URL = (areaCode: string) => `${API_DOMAIN}/festival/searchFestivalList?areaCode=${areaCode}`;
const GET_FESTIVAL_URL = (contentId: string) => `${API_DOMAIN}/festival/getFestival?contentId=${contentId}`;
const PATCH_FESTIVAL_URL = (contentId: string) => `${API_DOMAIN}/festival/patchFestival?contentId=${contentId}`;

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
export const getAnswerRequest = async (answerId: number | string) => {
    const result = await axios.get(GET_ANSWER_URL(answerId))
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

export const postAnswerRequest = async (requestBody: PostAnswerRequestDto) => {
    const result = await axios.post(POST_ANSWER_URL(), requestBody)
        .then(response => {
            const responseBody: PostAnswerResponseDto = response.data;
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