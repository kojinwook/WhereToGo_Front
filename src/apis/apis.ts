import axios from "axios";
import PostFestivalResponseDto from "./response/festival/post-festival-list.response.dto";
import { ResponseDto } from "./response/response";

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const POST_FESTIVAL_LIST_URL = (date: string) => `${API_DOMAIN}/festival/saveFestivalList?eventStartDate=${date}`;
const GET_FESTIVAL_LIST_URL = () => `${API_DOMAIN}/festival/getFestivalList`;
const GET_SEARCH_FESTIVAL_LIST_URL = (areaCode: string) => `${API_DOMAIN}/festival/searchFestivalList?areaCode=${areaCode}`;

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