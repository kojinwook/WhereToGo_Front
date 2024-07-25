import { FileUploadRequest, ReportUserRequest } from 'apis/apis';
import { ReportUserRequestDto } from 'apis/request/user';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Images } from 'types/interface/interface';
// import './style.css';

export default function ReportUser() {

    const { loginUser } = useLoginUserStore();
    const { reportUserNickname } = useParams();
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string>('');
    const [reportType, setReportType] = useState<string>('');
    const [incidentDescription, setIncidentDescription] = useState<string>('');
    const [incidentTimeDate, setIncidentTimeDate] = useState<string>('');
    const [incidentLocation, setIncidentLocation] = useState<string>('');
    const [impactDescription, setImpactDescription] = useState<string>('');
    const [imageFileList, setImageFileList] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

    const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setReportType(e.target.value);
    };

    const handleIncidentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIncidentDescription(e.target.value);
    };

    const handleIncidentTimeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIncidentTimeDate(e.target.value);
    };

    const handleIncidentLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIncidentLocation(e.target.value);
    };

    const handleImpactDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setImpactDescription(e.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const files = Array.from(event.target.files);
        setImageFileList(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleImageRemove = (index: number) => {
        const newImageFileList = [...imageFileList];
        newImageFileList.splice(index, 1);
        setImageFileList(newImageFileList);

        const newImagePreviews = [...imagePreviews];
        newImagePreviews.splice(index, 1);
        setImagePreviews(newImagePreviews);
    };

    const handleReportUser = async () => {
        const imageList: Images[] = [];
        for (const file of imageFileList) {
            const formData = new FormData();
            formData.append('file', file);
            const imageUrl = await FileUploadRequest(formData);
            if (imageUrl) {
                imageList.push(imageUrl);
            }
        }
        if (!reportUserNickname || !reportType || !incidentDescription || !incidentTimeDate || !incidentLocation || !impactDescription) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        const requestBody: ReportUserRequestDto = {
            reportUserNickname: reportUserNickname,
            reportType: reportType,
            incidentDescription: incidentDescription,
            incidentTimeDate: incidentTimeDate,
            incidentLocation: incidentLocation,
            impactDescription: impactDescription,
            imageList: imageList
        };
        const response = await ReportUserRequest(userId, requestBody, cookies.accessToken);
        console.log(response);
        if (!response) return;
        if (response.code === 'SU') {
            alert('신고가 접수되었습니다.');
            navigate('/');
            return;
        } else {
            alert('신고에 실패했습니다.');
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
                <label htmlFor="incidentDescription">사건 설명</label>
                <textarea
                    id="incidentDescription"
                    onChange={handleIncidentDescriptionChange}
                    value={incidentDescription}
                    placeholder="사건 설명을 입력하세요"
                ></textarea>
            </div>
            <div>
                <label htmlFor="incidentTimeDate">시간 및 날짜</label>
                <input
                    type="datetime-local"
                    id="incidentTimeDate"
                    onChange={handleIncidentTimeDateChange}
                    value={incidentTimeDate}
                />
            </div>
            <div>
                <label htmlFor="incidentLocation">위치</label>
                <input
                    type="text"
                    id="incidentLocation"
                    onChange={handleIncidentLocationChange}
                    value={incidentLocation}
                    placeholder="위치를 입력하세요"
                />
            </div>
            <div>
                <label htmlFor="impactDescription">개인적 영향</label>
                <textarea
                    id="impactDescription"
                    onChange={handleImpactDescriptionChange}
                    value={impactDescription}
                    placeholder="개인적 영향을 입력하세요"
                ></textarea>
            </div>
            <p><strong>사진</strong></p>
            <input type="file" multiple onChange={handleImageChange} />
            <div style={{ display: 'flex', marginTop: '10px' }}>
                {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                        <img
                            src={preview}
                            alt={`이미지 미리보기 ${index}`}
                            style={{ width: '100px', height: 'auto', marginRight: '10px' }}
                        />
                        <button
                            style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => handleImageRemove(index)}
                        >
                            <i className="fas fa-times-circle" style={{ fontSize: '1.5rem', color: 'gray' }} />
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={handleReportUser}>신고하기</button>
        </div>
    );
}
