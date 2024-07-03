import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GetFestivalListRequest, PostFestivalListRequest } from '../apis/apis';
import Festival from '../types/interface/festival.interface';

const SaveFestivalList = () => {
    const [festivalList, setFestivalList] = useState<Festival[]>();

    useEffect(() => {
        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return `${year}${month}${day}`;
        };

        const currentDate = getCurrentDate();

        const saveFestivalList = async (date: string) => {
            const response = await PostFestivalListRequest(date);
            console.log(response);
        };

        saveFestivalList(currentDate);
    }, []);

    useEffect(() => {
        const getFestivalList = async () => {
            const response = await GetFestivalListRequest();
            if (response.code === 'SU' && response.festivalList) {
                setFestivalList(response.festivalList);
            }
            // console.log(response);
        };

        getFestivalList();
    }, []);

    if(!festivalList) return null;
    return (
        <div>
            {festivalList.map((festival, index) => (
                <div key={index}>
                    {festival.title}
                </div>
            ))}
        </div>
    );
};

export default SaveFestivalList;
