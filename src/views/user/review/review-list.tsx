import { GetReviewListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import Review from 'types/interface/review.interface';
import Festival from 'types/interface/festival.interface';
import { GetReviewListResponseDto } from 'apis/response/review/review';
import { ResponseDto } from 'apis/response/response';
import './style.css';

interface ResponseData {
    code: string;
    reviews: Review[];
    festivalList: Festival[];
}

export default function ReviewList() {
    const { nickname } = useParams();
    const [reviewList, setReviewList] = useState<Review[]>([]);
    const [festivalList, setFestivalList] = useState<Festival[]>([]);
    const navigate = useNavigate()

    const formatDate = (createDateTime: string, modifyDateTime?: string) => {
        const isoDate = modifyDateTime ?? createDateTime;
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        let period = hours < 12 ? '오전' : '오후';
        if (hours === 0) {
            hours = 12;
        } else if (hours > 12) {
            hours -= 12;
        }

        return `${year}.${month}.${day} ${period} ${hours}:${minutes}`;
    };

    useEffect(() => {
        if (!nickname) {
            alert('로그인이 필요합니다.');
            navigate('/authentication/signin');
            return;
        };
        const fetchReviewList = async () => {
            const response: GetReviewListResponseDto | ResponseDto | null = await GetReviewListRequest(nickname);
            if (response && 'reviews' in response && 'festivalList' in response) {
                const responseData = response as ResponseData;
                setReviewList(responseData.reviews);
                setFestivalList(responseData.festivalList);
            } else {
                console.log('Invalid response:', response);
            }
        };
        fetchReviewList();
    }, [nickname]);

    const renderStars = (rating: number, displayRatingValue?: boolean) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<i key={i} className="fas fa-star" style={{ color: 'gold' }}></i>);
            } else if (i - 0.5 <= rating) {
                stars.push(<i key={i} className="fas fa-star-half-alt" style={{ color: 'gold' }}></i>);
            } else {
                stars.push(<i key={i} className="far fa-star" style={{ color: 'gold' }}></i>);
            }
        }
        return (
            <div className="star-container">
                {stars}
                {displayRatingValue && <span className="rating-value"> {rating.toFixed(1)}</span>}
            </div>
        );
    };

    const findFestivalByContentId = (contentId: string | number) => {
        return festivalList.find(festival => festival.contentId === contentId);
    };

    const buttonClickHandler = (contentId: string | number) => {
        navigate(`/festival/detail?contentId=${contentId}`)
    }

    return (
        <div className="review-list-entitle">
            {reviewList.length > 0 ? (
                reviewList.map((review, index) => {
                    const festival = findFestivalByContentId(review.contentId);
                    return (
                        <div key={review.reviewId} className="review-item">
                            {festival && (
                                <div>
                                    <h3 className='review-title' onClick={() => buttonClickHandler(festival.contentId)}>{festival.title}</h3>
                                    <img src={festival.firstImage} alt={festival.title} style={{ maxWidth: '200px' }} />
                                </div>
                            )}
                            <p>{renderStars(review.rate)} {formatDate(review.writeDatetime)}</p>
                            <div className="review-images">
                                {review.imageList && review.imageList.length > 0 ? (
                                    review.imageList.map((image, idx) => (
                                        <img key={idx} src={image.image} alt={`리뷰 이미지 ${idx}`} className="review-image" />
                                    ))
                                ) : (
                                    <></>
                                )}
                            </div>
                            <p>{review.review}</p>
                        </div>
                    );
                })
            ) : (
                <p>리뷰가 없습니다.</p>
            )}
        </div>
    );
}
