import { ReportUserRequest } from 'apis/apis';
import { ReportUserRequestDto } from 'apis/request/user';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';

export default function ReportUser() {

    const { loginUser } = useLoginUserStore();
    const { reportUserNickname } = useParams();
    const [userId, setUserId] = useState<string>('');
    const [reportContent, setReportContent] = useState<string>('');
    const [cookies] = useCookies()

    useEffect(() => {
        if (loginUser)
            setUserId(loginUser.userId);
    }, [])

    const handleReportContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReportContent(e.target.value);
    }

    const handleReportUser = async () => {
        if(!reportUserNickname || !reportContent) return;
        const requestBody: ReportUserRequestDto = { reportUserNickname: reportUserNickname, reportContent: reportContent };
        const response = await ReportUserRequest(userId, requestBody, cookies.accessToken);
        console.log(response);
        if(!response) return;
        if(response.code === 'SU') {
            alert('신고가 완료되었습니다.');
            return;
        }
    }

    return (
        <div>
            <div>신고할 유저: {reportUserNickname}</div>
            <div>신고 내용</div>
            <textarea onChange={handleReportContentChange} value={reportContent}></textarea>
            <button onClick={handleReportUser}>신고하기</button>
        </div>
    )
}
