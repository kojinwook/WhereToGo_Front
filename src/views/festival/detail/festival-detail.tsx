import { GetAverageRateRequest, GetFestivalRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Festival } from 'types/interface/interface';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function FestivalDetail() {

    const query = useQuery();
    const contentId = query.get('contentId');
    const [festival, setFestival] = useState<Festival>();
    const [averageRate, setAverageRate] = useState<number>(0);

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
                if (festivalResponse.code === 'SU') {
                    const fetchedFestival = festivalResponse.festival;
                    fetchedFestival.startDate = formatDate(fetchedFestival.startDate);
                    fetchedFestival.endDate = formatDate(fetchedFestival.endDate);
                    setFestival(fetchedFestival);
                } else {
                    console.error('Failed to fetch festival:', festivalResponse.message);
                }

                const averageRateResponse = await GetAverageRateRequest(contentId);
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
    }, [festival]); // useEffect는 festival이 변경될 때마다 호출됩니다.

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

    if (!festival) return null;
    return (
        <div>
            <p><strong>First Image:</strong> <img src={festival.firstImage} alt={festival.title} style={{ maxWidth: '200px' }} /></p>
            <p><strong>Title:</strong> {festival.title}</p>
            <div>{renderStars(averageRate)}</div>
            <p><strong>주소:</strong> {festival.address1}</p>
            <p><strong>기간:</strong> {festival.startDate} ~ {festival.endDate}</p>
            <p><strong>번호:</strong> {festival.tel}</p>
            <p><strong>웹사이트:</strong> {festival.homepage ? <a href={festival.homepage}>{festival.homepage}</a> : 'N/A'}</p>
            <p><strong>태그:</strong> {festival.tags}</p>
            {/* <p><strong>First Image:</strong> <img src={festival.firstImage} alt={festival.title} style={{ maxWidth: '200px' }} /></p> */}
            <button onClick={handleNavigateClick}>길찾기</button>
            <div id="map" style={{ width: '50%', height: '400px' }}></div>
        </div>
    )
}
