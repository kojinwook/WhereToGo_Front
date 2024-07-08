import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GetFestivalListRequest, PostFestivalListRequest } from '../../apis/apis';
import { Festival } from 'types/interface/interface';

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
                    console.log("성공 응답을 받았습니다.");
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
