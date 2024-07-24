import { DeleteMeetingBoardRequest, DeleteMeetingRequest, GetBoardReplyRequest, GetMeetingBoardRequest, PostBoardReplyRequest, PostReplyReplyRequest } from 'apis/apis';
import { PostBoardReplyRequestDto, PostReplyReplyRequestDto } from 'apis/request/meeting/board/reply';
import defaultProfileImage from 'assets/images/user.png';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { BoardReply, MeetingBoard } from 'types/interface/interface';
import './style.css';

export default function BoardDetail() {
    const { meetingId, meetingBoardId } = useParams();
    const { loginUser } = useLoginUserStore();
    const [board, setBoard] = useState<MeetingBoard>();
    const [answer, setAnswer] = useState(); //댓글
    const [reAnswer, setReAnswer] = useState(); //대댓글
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string>("");
    const [writerNickname, setWriterNickname] = useState<string>("");
    const [reply, setReply] = useState<string>("");
    const [replyList, setReplyList] = useState<BoardReply[]>([]);
    const [replyReply, setReplyReply] = useState<string>('');
    const [cookies] = useCookies();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [role, setRole] = useState<string>('')
    const [showOptions, setShowOptions] = useState(false);
    const navigate = useNavigate();

    const formatDate = (createDateTime: string) => {
        const isoDate = createDateTime;
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
        return `${year}.${month}.${day}. ${period} ${hours}:${minutes}`;
    };

    useEffect(() => {
        if (loginUser) {
            setNickname(loginUser.nickname);
        }
    }, [loginUser]);

    const fetchReplyList = async () => {
        if (!meetingBoardId) return;
        const response = await GetBoardReplyRequest(meetingBoardId);
        if (!response) return;
        console.log(response);
        if (response && response.code === 'SU') {
            setReplyList(response.replyList);
        } else {
            console.error('Failed to fetch reply list');
        }
    }

    useEffect(() => {
        fetchReplyList();
    }, [meetingBoardId]);

    useEffect(() => {
        if (!meetingBoardId) return;
        const fetchBoard = async () => {
            const response = await GetMeetingBoardRequest(meetingBoardId);
            if (!response) return;
            if (response && response.code === 'SU') {
                setBoard(response.meetingBoard);
                setProfileImage(response.meetingBoard.userDto.profileImage);
                setWriterNickname(response.meetingBoard.userDto.nickname);
            } else {
                console.error('Failed to fetch board');
            }
        }
        fetchBoard();
    }, [meetingBoardId]);

    const onReplyButtonClickHandler = async () => {
        if (!meetingBoardId || !reply || !nickname) return;
        const requestBody: PostBoardReplyRequestDto = { meetingBoardId, reply }
        const response = await PostBoardReplyRequest(requestBody, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('댓글이 작성되었습니다.');
            setReply("");
            fetchReplyList(); // 댓글 리스트를 다시 불러옵니다.
        } else {
            console.error('Failed to post reply');
        }
    }

    const onReplyReplyButtonClickHandler = async (parentCommentId: number) => {
        if (!replyReply || !nickname) return;
        const requestBody: PostReplyReplyRequestDto = { parentCommentId, replyReply: replyReply }
        const response = await PostReplyReplyRequest(requestBody, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('대댓글이 작성되었습니다.');
            setReplyReply("");
            fetchReplyList(); // 댓글 리스트를 다시 불러옵니다.
        } else {
            console.error('Failed to post reply');
        }
    }

    const onUpdateBoardButtonClickHandler = () => {
        navigate(`/meeting/board/update/${meetingBoardId}`);
    }

    const backGoPathClickHandler = () => {
        navigate(`/meeting/detail/${meetingId}`);
    }

    // 이미지 넘기기 함수
    const nextImage = () => {
        if (board && board.imageList) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % board.imageList.length);
        }
    };
    
    const prevImage = () => {
        if (board && board.imageList) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + board.imageList.length) % board.imageList.length);
        }
    };
    
    // 더보기
    const toggleOptions = () => {
        setShowOptions((prev) => !prev);
    };

    // 수정
    const updateBoardClickHandler = (meetingBoardId: number | string | undefined) => {
        if (!meetingBoardId) return;
        navigate(`/meeting/board/update/${meetingBoardId}`);
    };

    const updateAnswerClickHandler = (answer: number | string | undefined) => {
        if (!answer) return;
        navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
    };
    
    const updateReAnswerClickHandler = (reAnswer: number | string | undefined) => {
        if (!reAnswer) return;
        navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
    };

    // 삭제
    const deleteBoardButtonClickHandler = async (meetingBoardId: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteMeetingBoardRequest(meetingBoardId, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('게시물이 삭제되었습니다.');
            navigate(`/meeting/board/list/${meetingId}`);
        } else if (response.code === 'DHP') {
            alert('게시물을 삭제할 수 있는 권한이 없습니다.');
        } else {
            console.error('Failed to delete board');
        }
    }

    const deleteAnswerButtonClickHandler = async (answer: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteMeetingBoardRequest(answer, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('댓글이 삭제되었습니다.');
            navigate(`/meeting/board/detail/${meetingId}/%{meetingBoardId}`);
        } else if (response.code === 'DHP') {
            alert('댓글을 삭제할 수 있는 권한이 없습니다.');
        } else {
            console.error('Failed to delete board');
        }
    }

    const deleteReAnswerButtonClickHandler = async (reAnswer: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteMeetingBoardRequest(reAnswer, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('대댓글이 삭제되었습니다.');
            navigate(`/meeting/board/detail/${meetingId}/%{meetingBoardId}`);
        } else if (response.code === 'DHP') {
            alert('대댓글을 삭제할 수 있는 권한이 없습니다.');
        } else {
            console.error('Failed to delete board');
        }
    }

    const reportUserButtonClickHandler = (reportUserNickname: string) => {
        navigate(`/user/report/${reportUserNickname}`);
    }
    
    return (
        <div className='board-detail-container'>
            <div className='board-detail-header'>
                <div className='board-detail-name'>
                    <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backGoPathClickHandler} />
                </div>
                <img className='board-detail-sharing' src="https://i.imgur.com/hA50Ys8.png" alt="공유" onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('링크가 복사되었습니다!'); // 성공 메시지
                    } catch (err) {
                        console.error('링크 복사 실패:', err);
                    }
                }} />
            </div>

            <div className='board-detail-body'>
                <div className="board-detail-left">
                    <div className="board-img">
                        {board?.imageList?.map((image, index) => (
                            <img
                                key={index}
                                src={image.image}
                                alt={`Board image ${index + 1}`}
                                className={currentIndex === index ? 'active' : ''}
                            />
                        ))}
                        <button className="board-img-button left" onClick={prevImage}>◀</button>
                        <button className="board-img-button right" onClick={nextImage}>▶</button>
                    </div>
                </div>

                <div className="board-detail-right">
                    <div className="board-more-options">
                        <img className='board-profile-img' src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' />

                        {(writerNickname === nickname || role === "ROLE_ADMIN") && (
                            <img className="board-more-button" src="https://i.imgur.com/MzCE4nf.png" alt="더보기" onClick={toggleOptions} />
                        )}
                        {showOptions && (
                            <div className="board-button-box">
                                {writerNickname === nickname && (
                                    <button
                                        className="update-button"
                                        onClick={() => updateBoardClickHandler(board?.meetingBoardId)}
                                    >
                                        수정
                                    </button>
                                )}
                                {(writerNickname === nickname || role === "ROLE_ADMIN") && (
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteBoardButtonClickHandler(Number(board?.meetingBoardId))}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <p>{writerNickname}</p>
                        <p>제목</p>
                        <div className="board-info-div">{board?.title}</div>
                        <p>주소</p>
                        <div className="board-info-div">{board?.address}</div>
                        <p>내용</p>
                        <div className="board-info-div">{board?.content}</div>
                    </div>
                </div>
            </div>
        
            <div className='board-answer'>
                <div className='board-answer-add'>
                    <input className='board-answer-input' type="text" value={reply} onChange={(e) => setReply(e.target.value)} />
                    <button className='board-answer-btn' onClick={onReplyButtonClickHandler}>댓글 등록</button>
                </div>
                {replyList.map((replyItem) => (
                    <div key={replyItem.replyId} className='board-answer-item'>
                        <div className='board-answer-list'>
                            <div className='board-answer-header'>
                                <img className='answer-profile-img' src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' />
                                <p className='answer-nickname'>{replyItem.userDto.nickname}</p>
                                <div className='answer-date'>{formatDate(replyItem.createDate)}</div>
                                
                                <div className="answer-more-options">
                                    {(replyItem.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
                                        <img className="board-more-button" src="https://i.imgur.com/MzCE4nf.png" alt="더보기" onClick={toggleOptions} />
                                    )}
                                    {showOptions && (
                                        <div className="board-button-box">
                                            {replyItem.userDto.nickname === nickname && (
                                                <button
                                                    className="update-button"
                                                    // onClick={() => updateAnswerClickHandler(answer?.answerId)}
                                                >
                                                    수정
                                                </button>
                                            )}
                                            {(replyItem.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
                                                <button
                                                    className="delete-button"
                                                    // onClick={() => deleteAnswerButtonClickHandler(answer?.answerId)}
                                                >
                                                    삭제
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='answer-reply-content'>{replyItem.reply}</div>
                            <div className='answer-reply-reply'>
                                <input className='answer-reply-reply-input' type="text" value={replyReply} onChange={(e) => setReplyReply(e.target.value)} />
                                <button className='answer-reply-reply-btn' onClick={() => onReplyReplyButtonClickHandler(replyItem.replyId)}>대댓글 작성</button>
                            </div>
                            <div className='board-replies'>
                                {replyItem.replies.map((replyReplyItem) => (
                                    <div key={replyReplyItem.replyReplyId} className='board-reply-reply-item'>
                                        <div className='board-answer-header'>
                                            <img className='answer-profile-img' src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' />
                                            <p className='answer-nickname'>{replyReplyItem.userDto.nickname}</p>
                                            <div className='answer-date'>{formatDate(replyReplyItem.createDate)}</div>

                                            <div className="answer-more-options">
                                                {(replyReplyItem.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
                                                    <img className="board-more-button" src="https://i.imgur.com/MzCE4nf.png" alt="더보기" onClick={toggleOptions} />
                                                )}
                                                {showOptions && (
                                                    <div className="board-button-box">
                                                        {replyReplyItem.userDto.nickname === nickname && (
                                                            <button
                                                                className="update-button"
                                                                // onClick={() => updateReAnswerClickHandler(reAnswer.reAnswerId)}
                                                            >
                                                                수정
                                                            </button>
                                                        )}
                                                        {(replyReplyItem.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
                                                            <button
                                                                className="delete-button"
                                                                // onClick={() => deleteReAnswerButtonClickHandler(Number(board?.meetingId))}
                                                            >
                                                                삭제
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className='answer-reply-content'>{replyReplyItem.replyReply}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
