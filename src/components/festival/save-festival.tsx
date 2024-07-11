import React, { useEffect } from 'react';
import { PostFestivalListRequest } from '../../apis/apis';

const SaveFestivalList = () => {

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
            try {
                const response = await PostFestivalListRequest(date);
                console.log(response);
                if (response.code === 'SU') {
                    console.log("성공");
                    return;
                }
            } catch (error) {
                console.error("요청에 실패했습니다. 다시 시도합니다...", error);
            }
            setTimeout(() => saveFestivalList(date), 1000);
        };
        saveFestivalList(currentDate);
    }, []);

    return (
        <></>
    );
};

export default SaveFestivalList;
