import React from 'react'
import { useLocation } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function FestivalDetail() {

    const query = useQuery();
    const contentId = query.get('contentId');


    return (
        <div>FestivalDetail</div>
    )
}
