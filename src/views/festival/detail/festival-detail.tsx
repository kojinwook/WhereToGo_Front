import { GetFestivalRequest } from 'apis/apis';
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

    const formatDate = (dateStr: string) => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}년 ${month}월 ${day}일`;
    }

    useEffect(() => {
        const fetchFestival = async () => {
            if (!contentId) return;
            const response = await GetFestivalRequest(contentId);
            console.log(response);
            if (response.code === 'SU') {
                const fetchedFestival = response.festival;
                fetchedFestival.startDate = formatDate(fetchedFestival.startDate);
                fetchedFestival.endDate = formatDate(fetchedFestival.endDate);
                setFestival(fetchedFestival);
            }
        }
        fetchFestival();
    }, [contentId]);

    if (!festival) return <div>Loading...</div>;
    return (
        <div>
            <p><strong>Title:</strong> {festival.title}</p>
                        <p><strong>주소:</strong> {festival.address1}</p>
                        <p><strong>기간:</strong> {festival.startDate} ~ {festival.endDate}</p>
                        <p><strong>번호:</strong> {festival.tel}</p>
                        <p><strong>웹사이트:</strong> {festival.homepage ? <a href={festival.homepage}>{festival.homepage}</a> : 'N/A'}</p>
                        <p><strong>태그:</strong> {festival.tags}</p>
                        {/* <p><strong>First Image:</strong> <img src={festival.firstImage} alt={festival.title} style={{ maxWidth: '200px' }} /></p> */}
        </div>
    )
}
