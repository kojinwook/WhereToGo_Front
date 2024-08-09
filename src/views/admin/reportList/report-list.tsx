import { GetUserReportListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { ReportUser } from 'types/interface/interface';

export default function ReportList() {

    const { nickname } = useParams();
    const [reportList, setReportList] = useState<ReportUser[]>([]);
    const [cookies] = useCookies();

    useEffect(() => {
        if (!nickname) return;
        const fetchReportList = async () => {
            try {
                const response = await GetUserReportListRequest(nickname, cookies.accessToken);
                if (!response) return;
                if (response.code === 'SU') {
                    setReportList(response?.reportList);
                }
                else if (response.code === 'DHP') {
                    alert('접근 권한이 없습니다.');
                    return;
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchReportList();
    }, []);

    return (
        <div>
            <h1>신고 목록</h1>
            <ul>
                {reportList.length === 0 && <li>신고 목록이 없습니다.</li>}
                {reportList.map((report, index) => (
                    <li key={index}>
                        <div>신고자: {report.userNickname}</div>
                        <div>신고 유저: {report.reportUserNickname}</div>
                        <div>신고 유형: {report.reportType}</div>
                        <div>사건 설명: {report.incidentDescription}</div>
                        <div>사건 시간: {report.incidentTimeDate}</div>
                        <div>사건 위치: {report.incidentLocation}</div>
                        <div>영향 설명: {report.impactDescription}</div>
                        <div>신고 날짜: {report.reportDate}</div>
                        <div>이미지: {report.imageList.map((image, index) => (
                            <img key={index} src={image.image} alt="신고 이미지" />
                        ))}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
