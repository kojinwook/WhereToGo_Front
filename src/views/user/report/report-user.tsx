import { ReportUserRequest } from 'apis/apis';
import { ReportUserRequestDto } from 'apis/request/user';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
// import './style.css';

export default function ReportUser() {

    const { loginUser } = useLoginUserStore();
    const { reportUserNickname } = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const [reportContent, setReportContent] = useState<string>('');
    const [reportType, setReportType] = useState<string>('');
    const [cookies] = useCookies();

    const reportTypes = [
        "스팸/광고",
        "욕설/비하/혐오 표현",
        "괴롭힘/사이버 불링",
        "부적절한 콘텐츠",
        "사기/사칭",
        "개인정보 침해",
        "위협/위험한 행동",
        "지적 재산권 침해",
        "거짓 정보/허위 사실",
        "부적절한 프로필/아이디",
        "기타 규정 위반",
        "기타"
    ];

    useEffect(() => {
        if (loginUser) {
            setUserId(loginUser.userId);
        }
    }, [loginUser]);

    const handleReportContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReportContent(e.target.value);
    };

    const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setReportType(e.target.value);
    };

    const handleReportUser = async () => {
        if (!reportUserNickname || !reportContent || !reportType) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        const requestBody: ReportUserRequestDto = {
            reportUserNickname: reportUserNickname,
            reportContent: `${reportType}: ${reportContent}`
        };
        const response = await ReportUserRequest(userId, requestBody, cookies.accessToken);
        console.log(response);
        if (!response) return;
        if (response.code === 'SU') {
            alert('신고가 완료되었습니다.');
            navigate('/');
            return;
        }
    };

    return (
        <div className="report-user-container">
            <h2>유저 신고</h2>
            <div>
                <label>신고할 유저: {reportUserNickname}</label>
            </div>
            <div>
                <label htmlFor="reportType">신고 유형</label>
                <select id="reportType" value={reportType} onChange={handleReportTypeChange}>
                    <option value="">신고 유형을 선택하세요</option>
                    {reportTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="reportContent">신고 내용</label>
                <textarea
                    id="reportContent"
                    onChange={handleReportContentChange}
                    value={reportContent}
                    placeholder="신고 내용을 입력하세요"
                ></textarea>
            </div>
            <button onClick={handleReportUser}>신고하기</button>
        </div>
    );
}
