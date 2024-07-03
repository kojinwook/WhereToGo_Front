import axios from "axios";
import PostFestivalResponseDto from "./response/festival/post-festival.response.dto";
import { ResponseDto } from "./response/response";

const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const POST_FESTIVAL_URL = (date: string) => `${API_DOMAIN}/festival/saveFestivalList?eventStartDate=${date}`;

export const saveFestivalList = async (date: string) => {
    const result = await axios.post(POST_FESTIVAL_URL(date), null)
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