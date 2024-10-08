import React, { useEffect, useState } from 'react';
import { GetAllFavoriteRequest, GetAverageRateRequest, GetFestivalListRequest, GetSearchFestivalListRequest, PutFavoriteRequest } from '../../../apis/apis';
import { Festival } from 'types/interface/interface';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useLoginUserStore from 'store/login-user.store';
import Pagination from 'components/Pagination';

export default function FestivalPage() {
    const { loginUser } = useLoginUserStore();
    const [searchFestivalList, setSearchFestivalList] = useState<Festival[]>([]);
    const [averageRates, setAverageRates] = useState<{ [key: string]: number }>({});
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
    const [cookies] = useCookies();
    const [nickname, setNickname] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (loginUser) {
            setNickname(loginUser.nickname);
        }
    }, [loginUser]);

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

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!loginUser) return;
            const response = await GetAllFavoriteRequest(loginUser.nickname, cookies.accessToken);
            if (response && response.code === 'SU') {
                const favoriteIds: { [key: string]: boolean } = {};
                response.favoriteList.forEach((favorite: { contentId: string }) => {
                    favoriteIds[favorite.contentId] = true;
                });
                setFavorites(favoriteIds);
            }
        };
        fetchFavorites();
    }, [loginUser, cookies.accessToken]);

    const getFestivalList = async () => {
        const response = await GetFestivalListRequest();
        if (!response) return;
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
        const query = new URLSearchParams(location.search);
        const areaCode = query.get('areaCode') || '';
        if (areaCode) {
            getSearchFestivalList(areaCode);
        } else {
            getFestivalList();
        }
    }, [location.search]);

    useEffect(() => {
        const fetchAverageRates = async (festivalList: Festival[]) => {
            const requests = festivalList.map(festival => GetAverageRateRequest(festival.contentId));
            const responses = await Promise.all(requests);
            const rates: { [key: string]: number } = {};
            responses.forEach((response, index) => {
                if (!response) return;
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
        if (searchFestivalList.length > 0) {
            fetchAverageRates(searchFestivalList);
        }
    }, [searchFestivalList]);

    const searchFestivalByAreaCode = (areaCode: string) => {
        const query = new URLSearchParams(location.search);
        query.set('areaCode', areaCode);
        navigate(`?${query.toString()}`);
    };

    const getSearchFestivalList = async (areaCode: string) => {
        const response = await GetSearchFestivalListRequest(areaCode);
        if (!response) return;
        if (response.code === 'SU') {
            const formattedFestivals = response.festivalList.map(festival => ({
                ...festival,
                startDate: formatDate(festival.startDate),
                endDate: formatDate(festival.endDate)
            }));
            setSearchFestivalList(formattedFestivals);
        }
    };

    const handleTitleClick = (contentId: string) => {
        navigate(`/festival/detail?contentId=${contentId}`, { state: { from: location } });
    };

    const renderStars = (rating: number, displayRatingValue?: boolean) => {
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
        return (
            <div className="star-container">
                {stars}
                {displayRatingValue && <span className="rating-value"> {rating.toFixed(1)}</span>}
            </div>
        );
    };

    const onFavoriteClickHandler = async (contentId: string) => {
        if (!cookies.accessToken || !nickname) {
            alert('로그인이 필요합니다.');
            return;
        }
        try {
            const response = await PutFavoriteRequest(contentId, nickname, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                setFavorites(prevFavorites => ({
                    ...prevFavorites,
                    [contentId]: !prevFavorites[contentId]
                }));
            } else {
                console.error('Failed to toggle favorite:');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedFestivals = searchFestivalList.slice(startIndex, endIndex);

    // Pagination logic
    const totalPages = Math.ceil(searchFestivalList.length / itemsPerPage);
    const pageRange = 5;
    const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages, startPage + pageRange - 1);
    const viewPageList = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <div id='festival-list-wrapper'>
            <div className='festival-list-filter-container'>
                {areas.map(area => (
                    <p key={area.code} className='festival-list-filter' onClick={() => searchFestivalByAreaCode(area.code)}>{area.name}</p>
                ))}
            </div>
            <div className='festival-list-content-container'>
                <div className='festival-list-header'>
                    <div>축제명</div>
                    <div>주소</div>
                    <div>별점</div>
                    <div>날짜</div>
                    <div>찜</div>
                </div>
                {displayedFestivals.map((festival, index) => (
                    <div key={index} className='festival-list-content'>
                        <div className='festival-list-content-title' onClick={() => handleTitleClick(festival.contentId)}>{festival.title}</div>
                        <div>{festival.address1}</div>
                        <div>{renderStars(averageRates[festival.contentId] || 0, true)}</div>
                        <div>{festival.startDate} ~ {festival.endDate}</div>
                        <div className="icon-button" onClick={() => onFavoriteClickHandler(festival.contentId)}>
                            {favorites[festival.contentId] ? 
                                <i className="fas fa-heart favorite-fill-icon" style={{ color: 'red' }}></i> :
                                <i className="far fa-heart favorite-light-icon" style={{ color: 'grey' }}></i>
                            }
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination-box">
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    viewPageList={viewPageList}
                />
            </div>
        </div>
    );
}
