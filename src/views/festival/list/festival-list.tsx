import React, { useEffect, useState } from 'react'
import { GetAverageRateRequest, GetFestivalListRequest, GetSearchFestivalListRequest } from '../../../apis/apis';
import { Festival } from 'types/interface/interface';
import './style.css'
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ResponseDto from 'apis/response/response.dto';

export default function FestivalPage() {
    // const {loginUser} = useLoginUserStore();
    const [searchFestivalList, setSearchFestivalList] = useState<Festival[]>();
    const [averageRates, setAverageRates] = useState<{ [key: string]: number }>({});
    const [isFavorite, setFavorite] = useState<boolean>(false);
    // const [favoriteList, setFavoriteList] = useState<Favorite[]>([]);
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();

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

    const formatDate = (dateStr: string) => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}년 ${month}월 ${day}일`;
    };

    const getFestivalList = async () => {
        const response = await GetFestivalListRequest();
        if (response.code === 'SU') {
            const formattedFestivals = response.festivalList.map(festival => ({
                ...festival,
                startDate: formatDate(festival.startDate),
                endDate: formatDate(festival.endDate)
            }));
            setSearchFestivalList(formattedFestivals);
        }
    };

    useEffect(() => {
        getFestivalList();
    }, []);

    useEffect(() => {
        const fetchAverageRates = async (festivalList: Festival[]) => {
            const requests = festivalList.map(festival => GetAverageRateRequest(festival.contentId));
            const responses = await Promise.all(requests);
            const rates: { [key: string]: number } = {};
            responses.forEach((response, index) => {
                if (response.code === 'SU') {
                    const averageRates = response.average;
                    for (const [id, rate] of Object.entries(averageRates)) {
                        rates[id] = rate;
                    }
                } else {
                    rates[festivalList[index].contentId] = 0;
                }
            });
            setAverageRates(rates);
        };
        if (searchFestivalList) {
            fetchAverageRates(searchFestivalList);
        }
    }, [searchFestivalList]);

    const searchFestivalByAreaCode = async (areaCode: string) => {
        if (areaCode === '') {
            getFestivalList();
            return;
        }
        const response = await GetSearchFestivalListRequest(areaCode);
        if (response.code === 'SU') {
            const formattedFestivals = response.festivalList.map(festival => ({
                ...festival,
                startDate: formatDate(festival.startDate),
                endDate: formatDate(festival.endDate)
            }));
            setSearchFestivalList(formattedFestivals);
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

    const handleTitleClick = (contentId: string) => {
        navigate(`/festival/detail?contentId=${contentId}`);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<i key={i} className="fas fa-star" style={{ color: 'gold' }}></i>);
            } else if (i - 0.5 <= rating) {
                stars.push(<i key={i} className="fas fa-star-half-alt" style={{ color: 'gold' }}></i>);
            } else {
                stars.push(<i key={i} className="far fa-star" style={{ color: 'gold' }}></i>);
            }
        }
        return stars;
    };

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
                        <div className='festival-list-content-title' onClick={() => handleTitleClick(festival.contentId)}>{festival.title}</div>
                        <div>{festival.address1}</div>
                        <div>{renderStars(averageRates[festival.contentId] || 0)}</div>
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
