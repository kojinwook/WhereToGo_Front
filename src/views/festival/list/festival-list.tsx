import React, { useEffect, useState } from 'react'
import { GetFestivalListRequest, GetSearchFestivalListRequest } from '../../../apis/apis';
import { Festival } from 'types/interface/interface';
import './style.css'
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ResponseDto from 'apis/response/response.dto';

export default function FestivalPage() {
    // const {loginUser} = useLoginUserStore();
    const { contentId } = useParams();
    const [searchFestivalList, setSearchFestivalList] = useState<Festival[]>();
    const [isFavorite, setFavorite] = useState<boolean>(false);
    // const [favoriteList, setFavoriteList] = useState<Favorite[]>([]);
    const [cookies, setCookies] = useCookies();

    const areas = [
        { name: '전체', code: '' },
        { name: '서울', code: '1' },
        { name: '인천', code: '2' },
        { name: '대전', code: '3' },
        { name: '대구', code: '4' },
        { name: '광주', code: '5' },
        { name: '부산', code: '6' },
        { name: '울산', code: '7' },
        { name: '세종', code: '8' },
        { name: '경기', code: '31' },
        { name: '강원', code: '32' },
        { name: '충북', code: '33' },
        { name: '충남', code: '34' },
        { name: '경북', code: '35' },
        { name: '경남', code: '36' },
        { name: '전북', code: '37' },
        { name: '전남', code: '38' },
        { name: '제주', code: '39' }
    ];

    const getFestivalList = async () => {
        const response = await GetFestivalListRequest();
        console.log(response);
        if (response.code === 'SU') {
            setSearchFestivalList(response.festivalList);
        }
    };

    useEffect(() => {
        getFestivalList();
    }, []);

    const searchFestivalByAreaCode = async (areaCode: string) => {
        if (areaCode === '') {
            getFestivalList();
        }
        const response = await GetSearchFestivalListRequest(areaCode);
        if (response.code === 'SU') {
            setSearchFestivalList(response.festivalList);
        }
    };

    // const getFavoriteListResponse = (
    //     responseBody: GetFavoriteListResponseDto | ResponseDto | null
    // ) => {
    //     if (!responseBody) return;
    //     const { code } = responseBody;
    //     if (code === "NB") alert("존재하지 않습니다.");
    //     if (code === "DBE") alert("데이터베이스 오류입니다.");
    //     if (code !== "SU") return;

    //     const { favoriteList } = responseBody as GetFavoriteListResponseDto;
    //     setFavoriteList(favoriteList);

    // if (!loginUser) {
    //     setFavorite(false);
    //     return;
    // }
    //     const isFavorite =
    //         favoriteList.findIndex(
    //             (favorite) => favorite.userId === loginUser.userId
    //         ) !== -1;
    //     setFavorite(isFavorite);
    // };

    // const onFavoriteClickHandler = () => {
    //     if (!contentId || !loginUser || !cookies.accessToken) return;
    //     PutFavoriteRequest(contentId, cookies.accessToken).then(putFavoriteResponse);
    // };

    // const putFavoriteResponse = (
    //     responseBody: PutFavoriteResponseDto | ResponseDto | null
    // ) => {
    //     if (!responseBody) return;
    //     const { code } = responseBody;
    //     if (code === "VF") alert("잘못된 접근입니다.");
    //     if (code === "NU") alert("존재하지 않는 유저입니다.");
    //     if (code === "NB") alert("존재하지 않습니다.");
    //     if (code === "AF") alert("인증에 실패했습니다.");
    //     if (code === "DBE") alert("데이터베이스 오류입니다.");
    //     if (code !== "SU") return;

    //     if (!contentId) return;
    //     GetFavoriteListRequest(contentId).then(getFavoriteListResponse);
    // };

    // useEffect(() => {
    //     if (!contentId) return;
    //     GetFavoriteListRequest(contentId).then(getFavoriteListResponse);
    // }, [contentId]);

    if (!searchFestivalList) return null;
    return (
        <div id='festival-list-wrapper'>
            <div className='festival-list-filter-container'>
                {areas.map(area => (
                    <p key={area.code} className='festival-list-filter' onClick={() => searchFestivalByAreaCode(area.code)}>{area.name}</p>
                ))}
            </div>
            <div className='festival-list-content-container'>
                {searchFestivalList.map((festival, index) => (
                    <div key={index} className='festival-list-content'>
                        <div>{festival.title}</div>
                        <div>{festival.rates}</div>
                        <div>{festival.startDate} ~ {festival.endDate}</div>
                        {/* <div className="icon-button" onClick={onFavoriteClickHandler}>
                        {isFavorite ?
                            <div className="icon favorite-fill-icon"></div> :
                            <div className="icon favorite-light-icon"></div>
                        }
                    </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
