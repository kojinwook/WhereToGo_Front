import React, { useEffect, useState } from 'react'
import { GetFestivalListRequest, GetSearchFestivalListRequest } from '../../../apis/apis';
import { Festival } from 'types/interface/interface';

export default function FestivalPage() {

    const [searchFestivalList, setSearchFestivalList] = useState<Festival[]>();
    const [searchWord, setSearchWord] = useState<string>('');
    const [searchAreaCode, setSearchAreaCode] = useState<string>('');

    const getFestivalList = async () => {
        const response = await GetFestivalListRequest();
        console.log(response);
        if (response.code === 'SU') {
            setSearchFestivalList(response.festivalList);
        }
    };

    useEffect(() => {
        getFestivalList();
    }, []);

    const searchAreaCodeChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
        if (e.target.value === '서울') setSearchAreaCode('1');
        if (e.target.value === '인천') setSearchAreaCode('2');
        if (e.target.value === '대전') setSearchAreaCode('3');
        if (e.target.value === '대구') setSearchAreaCode('4');
        if (e.target.value === '광주') setSearchAreaCode('5');
        if (e.target.value === '부산') setSearchAreaCode('6');
        if (e.target.value === '울산') setSearchAreaCode('7');
        if (e.target.value === '세종') setSearchAreaCode('8');
        if (e.target.value === '경기') setSearchAreaCode('31');
        if (e.target.value === '강원') setSearchAreaCode('32');
        if (e.target.value === '충북') setSearchAreaCode('33');
        if (e.target.value === '충남') setSearchAreaCode('34');
        if (e.target.value === '경북') setSearchAreaCode('35');
        if (e.target.value === '경남') setSearchAreaCode('36');
        if (e.target.value === '전북') setSearchAreaCode('37');
        if (e.target.value === '전남') setSearchAreaCode('38');
        if (e.target.value === '제주') setSearchAreaCode('39');
        if (e.target.value === '') setSearchAreaCode('');
    }

    const searchButtonClickHandler = async () => {
        if (searchWord === '') {
            getFestivalList();
        } else {
            const response = await GetSearchFestivalListRequest(searchAreaCode);
            if (response.code === 'SU') {
                setSearchFestivalList(response.festivalList);
            }
        }
    }

    if (!searchFestivalList) return null;
    return (
        <div>
            <input type="text" onChange={searchAreaCodeChangeHandler} />
            <button onClick={searchButtonClickHandler}>{"검색"}</button>
            <div>
                {searchFestivalList.map((festival, index) => (
                    <div key={index}>
                        {festival.title}
                    </div>
                ))}
            </div>
        </div>
    );
}
