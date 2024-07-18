import { FileUploadRequest, GetReviewRequest, PatchReviewRequest } from 'apis/apis';
import PatchReviewRequestDto from 'apis/request/review/patch-review.request.dto';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import { Images } from 'types/interface/interface';
import './style.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ReviewWritePage() {
    const query = useQuery();
    const reviewId = query.get('reviewId');
    let reviewIds = Number(reviewId);
    const [rate, setRate] = useState<number>(0);
    const [review, setReview] = useState<string>('');
    const [imageFileList, setImageFileList] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [cookies] = useCookies();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchReview = async () => {
            setLoading(true);
            const response = await GetReviewRequest(reviewIds);
            if(!response) return;
            if (response.code === 'SU') {
                const reviewData = response.review;
                setRate(reviewData.rate);
                setReview(reviewData.review);

                const imageUrls = reviewData.images.map(image => image.image);
                setImagePreviews(imageUrls);
                setLoading(false);
            } else {
                alert('리뷰를 불러오는데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchReview();
    }, [reviewIds]);

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
        if (!cookies.accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }

        const ImageList: Images[] = [];
        for (const file of imageFileList) {
            const formData = new FormData();
            formData.append('file', file);

            const imageUrl = await FileUploadRequest(formData);
            if (imageUrl) {
                ImageList.push(imageUrl);
            }
        }

        const requestBody = { imageList: ImageList, review, rate } as unknown as PatchReviewRequestDto;
        const response = await PatchReviewRequest(reviewIds, requestBody, cookies.accessToken);
        if (!response) return;
        if (response.code === 'SU') {
            alert('리뷰가 성공적으로 수정되었습니다.');
            // 리뷰 수정 성공 후 추가적으로 필요한 처리
        } else {
            alert('리뷰 수정에 실패했습니다.');
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className='review-update-container'>
            <h1>리뷰 작성</h1>
            <div className='update-write'>
                <div><strong>별점</strong></div>
                <label className='review-update-label'>
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
                <div><strong>내용</strong></div>
                <label className='review-update-label'>
                    <textarea className={'review-update-content'} value={review} onChange={handleReviewChange} />
                </label>
                <br />
                <div><strong>이미지</strong></div>
                <input type="file" multiple onChange={handleImageChange} />
                <br />
                <div style={{ display: 'flex', marginTop: '10px' }}>
                    {imagePreviews.length > 0 ? (
                        imagePreviews.map((preview, index) => (
                            <div key={index} style={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                                <img
                                className='review-update-img'
                                    src={preview}
                                    alt={`이미지 미리보기 ${index}`}
                                    style={{ width: '100px', height: 'auto', marginRight: '10px' }}
                                />
                                <button className='review-update-btn'
                                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                                    onClick={() => handleImageRemove(index)}
                                >
                                    <i className="fas fa-times-circle" style={{ fontSize: '1.5rem', color: 'gray' }} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>

            <br />
            <button className='review-update-btn' onClick={handleSubmit}>리뷰 등록</button>
        </div>
    );
}
