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
        </div>
    )
}
