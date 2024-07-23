import { GetReviewListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import Review from 'types/interface/review.interface';
import Festival from 'types/interface/festival.interface';
import { GetReviewListResponseDto } from 'apis/response/review/review';
import { ResponseDto } from 'apis/response/response';

interface ResponseData {
    code: string;
    message: string;
    reviews: Review[];
    festivalList: Festival[];
}

export default function ReviewList() {
    const { loginUser } = useLoginUserStore();
    const { nickname } = useParams();
    const [userId, setUserId] = useState<string>('');
    const [reviewList, setReviewList] = useState<Review[]>([]);
    const [festivalList, setFestivalList] = useState<Festival[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        if (!nickname) return;
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
        <div>
            {reviewList.length > 0 ? (
                reviewList.map((review, index) => {
                    const festival = findFestivalByContentId(review.contentId);
                    return (
                        <div key={review.reviewId}>
                            {festival && (
                                <div>
                                    <h3>{festival.title}</h3>
                                    {/* <img src={festival.firstImage} alt={festival.title} style={{ maxWidth: '200px' }} /> */}
                                    <button onClick={() => buttonClickHandler(festival.contentId)}>{'축제 디테일'}</button>
                                </div>
                            )}
                            <p>{renderStars(review.rate)} {review.writeDatetime}</p>
                            <p><strong>작성자:</strong> {review.nickname}</p>
                            {/* <div className="review-images">
                                {review.images && review.images.length > 0 ? (
                                    review.images.map((image, idx) => (
                                        <img key={idx} src={image.image} alt={`리뷰 이미지 ${idx}`} className="review-image" />
                                    ))
                                ) : (
                                    <p><strong>사진:</strong> 없음</p>
                                )}
                            </div> */}
                            <p><strong>Review:</strong> {review.review}</p>
                        </div>
                    );
                })
            ) : (
                <p>리뷰가 없습니다.</p>
            )}
        </div>
    );
}
