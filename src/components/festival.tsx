import React, { useEffect } from 'react';
import axios from 'axios';

const SaveFestivalList = () => {
    useEffect(() => {
        // 현재 날짜를 YYYYMMDD 형식으로 구하기
        const getCurrentDate = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return `${year}${month}${day}`;
        };

        const currentDate = getCurrentDate();

        // API 호출을 통한 데이터 저장
        const saveFestivalList = async (date: string) => {
            try {
                const response = await axios.post('http://localhost:8080/api/v1/festival/saveFestivalList', null, {
                    params: { eventStartDate: date },
                });
                console.log('Festival data saved successfully:', response.data);
            } catch (error) {
                console.error('Error saving festival data:', error);
            }
        };

        saveFestivalList(currentDate);
    }, []);

    return <div>Loading...</div>;
};

export default SaveFestivalList;
