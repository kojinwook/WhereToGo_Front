import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { fileUploadRequest, PostReviewRequest } from 'apis/apis';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ReviewWritePage() {
    const query = useQuery();
    const contentId = query.get('contentId');
    let contentIds = Number(contentId);
    const navigate = useNavigate();
    const [rate, setRate] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [imageFileList, setImageFileList] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [cookies] = useCookies(['accessToken']);

    const handleRateChange = (newRate: number) => {
        setRate(newRate);
    };

    const handleStarHover = (hoverRate: number) => {
        setRate(hoverRate);
    };

    const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(event.target.value);
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

    const handleSubmit = async () => {
        // if (!cookies.accessToken) {
        //     alert('로그인이 필요합니다.');
        //     return;
        // }

        const ImageList: string[] = [];
        for (const file of imageFileList) {
            const formData = new FormData();
            formData.append('file', file);

            const imageUrl = await fileUploadRequest(formData);
            if (imageUrl) {
                ImageList.push(imageUrl);
            }
        }

        const response = await PostReviewRequest(contentIds, rate, review, ImageList, cookies.accessToken);
        if (response.code === 'SU') {
            alert('리뷰가 성공적으로 등록되었습니다.');
        } else {
            alert('리뷰 등록에 실패했습니다.');
        }
    };

    console.log(rate)

    return (
        <div>
            <h1>리뷰 작성 페이지</h1>
            <label>별점:
                {[...Array(5)].map((_, index) => (
                    <i
                        key={index}
                        className={index < rate ? 'fas fa-star' : 'far fa-star'}
                        style={{ cursor: 'pointer', color: index < rate ? 'gold' : 'grey' }}
                        onMouseEnter={() => handleStarHover(index + 1)}
                        onClick={() => handleRateChange(index + 1)}
                    />
                ))}
                <span style={{ marginLeft: '10px', fontSize: '1.5rem' }}>{rate}</span>
            </label>
            <br />
            <label>리뷰 내용:
                <textarea value={review} onChange={handleReviewChange} />
            </label>
            <br />
            <input type="file" multiple onChange={handleImageChange} />
            <br />
            <br />
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
            <br />
            <button onClick={handleSubmit}>리뷰 등록</button>
        </div>
    );
};
