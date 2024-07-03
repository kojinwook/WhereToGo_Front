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
            const response = await PostFestivalListRequest(date);
            console.log(response);
        };

        saveFestivalList(currentDate);
    }, []);

    return (
        <></>
    );
};

export default SaveFestivalList;
