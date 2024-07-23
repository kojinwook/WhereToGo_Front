import { GetAllReviewRequest, GetAverageRateRequest, GetFestivalRequest, GetReviewListRequest, PutFavoriteRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Festival } from 'types/interface/interface';
import Review from 'types/interface/review.interface';
import './style.css'
import { useCookies } from 'react-cookie';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function FestivalDetail() {

    const query = useQuery();
    const contentId = query.get('contentId');
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
    const [festival, setFestival] = useState<Festival>();
    const [averageRate, setAverageRate] = useState<number>(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showMap, setShowMap] = useState<boolean>(true);
    const [showReviews, setShowReviews] = useState<boolean>(false);
    const [nickname, setNickname] = useState<string>('');
    const [cookies, setCookies] = useCookies();

    const formatDate = (dateStr: string) => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}년 ${month}월 ${day}일`;
    }

    useEffect(() => {
        const fetchFestivalData = async () => {
            try {
                if (!contentId) return;
                const festivalResponse = await GetFestivalRequest(contentId);
                if (!festivalResponse) return;
                if (festivalResponse.code === 'SU') {
                    const fetchedFestival = festivalResponse.festival;
                    fetchedFestival.startDate = formatDate(fetchedFestival.startDate);
                    fetchedFestival.endDate = formatDate(fetchedFestival.endDate);
                    setFestival(fetchedFestival);
                } else {
                    console.error('Failed to fetch festival:', festivalResponse.message);
                }
                const averageRateResponse = await GetAverageRateRequest(contentId);
                if (!averageRateResponse) return;
                if (averageRateResponse.code === 'SU') {
                    const { average } = averageRateResponse;
                    setAverageRate(average[contentId] || 0);
                } else {
                    console.error('Failed to fetch average rate:', averageRateResponse.message);
                    setAverageRate(0);
                }
            } catch (error) {
                console.error('Error fetching festival data:', error);
            }
        };
        fetchFestivalData();
    }, [contentId]);

    useEffect(() => {
        const fetchReviewList = async () => {
            if (!contentId) return;
            const response = await GetAllReviewRequest(contentId);
            if (!response) return;
            if (response.code === 'SU') {
                setReviews(response.reviews);
            } else {
                return;
            }
        };
        fetchReviewList();
    }, [contentId]);

    useEffect(() => {
        // HTML에서 주소를 가져와서 지도를 표시하는 함수 정의
        const getAddressFromHTML = () => {
            if (!festival) return; // 축제 정보가 없는 경우 빠르게 반환
            const address = festival.address1; // 축제 주소를 가져옵니다.

            // 주소로 좌표를 검색하고 지도를 표시하는 함수 정의
            const searchAddressAndShowMap = (address: string) => {
                const mapContainer = document.getElementById('map');
                if (!mapContainer) return;

                // 카카오맵의 Geocoder 객체 생성
                const geocoder = new (window as any).kakao.maps.services.Geocoder();

                // 주소를 좌표로 변환하여 검색
                geocoder.addressSearch(address, (result: any, status: any) => {
                    if (status === (window as any).kakao.maps.services.Status.OK) {
                        const coords = new (window as any).kakao.maps.LatLng(result[0].y, result[0].x);

                        // 지도 옵션 설정
                        const mapOption = {
                            center: coords,
                            level: 3
                        };

                        // 지도 생성
                        const map = new (window as any).kakao.maps.Map(mapContainer, mapOption);

                        // 마커 생성
                        const marker = new (window as any).kakao.maps.Marker({
                            position: coords,
                            map: map
                        });
                    } else {
                        console.error('Geocoder failed: ' + status);
                    }
                });
            };

            // 주소를 검색하고 지도를 표시하는 함수 호출
            searchAddressAndShowMap(address);
        };

        // 축제 정보가 업데이트될 때마다 주소를 가져와서 지도를 표시하는 함수 호출
        getAddressFromHTML();
    }, [festival, showMap, showReviews]); // useEffect는 festival이 변경될 때마다 호출됩니다.

    const handleNavigateClick = () => {
        if (!festival) return;

        // 축제의 좌표를 URI 인코딩합니다.
        const lat = festival.mapY;
        const lng = festival.mapX;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

        // Kakao 맵 링크 생성
        const kakaoLink = `https://map.kakao.com/link/to/${festival.title},${lat},${lng}`;

        // 새 창에서 Kakao 맵 링크를 엽니다.
        window.open(kakaoLink);
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

    const reviewWriteButtonClickHandler = (contentId: string) => {
        navigate(`/festival/review/write?contentId=${contentId}`)
    }

    // 찜
    const onFavoriteClickHandler = async (contentId: string) => {
        if (!nickname) return;
        try {
            const response = await PutFavoriteRequest(contentId, nickname, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                setFavorites(prevFavorites => ({
                    ...prevFavorites,
                    [contentId]: !prevFavorites[contentId]
                }));
            } else {
                console.error('Failed to toggle favorite:', response.message);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const backGoPathClickHandler = () => {
        // navigate(`/festival/search`);
        window.history.back();
    }

    if (!festival) return null;
    return (
        <div className="festival-detail-container">
            <div className='festival-detail-header'>
                <div className='festival-detail-name'>
                    <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backGoPathClickHandler} />
                </div>
                <div className='festival-detail-option'>
                    <img className='festival-detail-sharing' src="https://i.imgur.com/hA50Ys8.png" alt="공유" onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(window.location.href);
                            alert('링크가 복사되었습니다!'); // 성공 메시지
                        } catch (err) {
                            console.error('링크 복사 실패:', err);
                        }
                    }} />
                    <div className="icon-button" onClick={() => onFavoriteClickHandler(festival.contentId)}>
                        {favorites[festival.contentId] ?
                            <i className="fas fa-heart favorite-fill-icon" style={{ color: 'red' }}></i> :
                            <i className="far fa-heart favorite-light-icon" style={{ color: 'grey' }}></i>
                        }
                    </div>
                </div>
            </div>

            <div className='festival-detail-body'>
                <div className='festival-main'>
                    <div className="festival-image">
                        <img src={festival.firstImage} alt={festival.title} />
                    </div>

                    <div className="festival-title">{festival.title}</div>
                    <div><strong>{renderStars(averageRate, true)}</strong></div>
                </div>

                <div className='festival-btn'>
                    <button onClick={() => { setShowMap(true); setShowReviews(false); }}>정보</button>
                    <button onClick={() => { setShowMap(false); setShowReviews(true); }}>후기</button>
                </div>

                <div className="festival-details">
                    {showMap && (
                        <div>
                            <div className='festival-information'>
                                <p><strong>주소 | </strong>{festival.address1}</p>
                                <p><strong>기간 | </strong>{festival.startDate} ~ {festival.endDate}</p>
                                <p><strong>시간 | </strong></p>
                                <p><strong>번호 | </strong>{festival.tel}</p>
                                <p><strong>웹사이트 | </strong>{festival.homepage ? <a href={festival.homepage}>{festival.homepage}</a> : 'N/A'}</p>
                                <p><strong>태그:</strong> {Array.isArray(festival.tags) ? festival.tags.map(tag => `#${tag}`).join(' ') : `#${festival.tags}`}</p>
                            </div>
                            <div className="map-container">
                                <button onClick={handleNavigateClick}>길찾기</button>
                                <div id="map"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="festival-review">
                    {showReviews && (
                        <div>
                            <button className='review-btn' onClick={() => reviewWriteButtonClickHandler(festival.contentId)}>리뷰 작성</button>
                            <h2>리뷰 리스트</h2>
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index}>
                                        <p>{renderStars(review.rate)} {review.writeDatetime}</p>
                                        <p><strong>작성자:</strong> {review.nickname}</p>
                                        <div className="review-images">
                                            {review.images && review.images.length > 0 ? (
                                                review.images.map((image, idx) => (
                                                    <img key={idx} src={image.image} alt={`리뷰 이미지 ${idx}`} className="review-image" />
                                                ))
                                            ) : (
                                                <p><strong>사진:</strong> 없음</p>
                                            )}
                                        </div>
                                        <p><strong>Review:</strong> {review.review}</p>
                                    </div>
                                ))
                            ) : (
                                <p>리뷰가 없습니다.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
