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

    const deleteBoardButtonClickHandler = async () => {
        if (!meetingBoardId) return;
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
    const updatePostClickHandler = (meetingId: number | string | undefined) => {
        if (!meetingId) return;
        navigate(`/meeting/update/${meetingId}`);
    };

    // 삭제
    const deleteMeetingButtonClickHandler = async (meetingId: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteMeetingRequest(meetingId, cookies.accessToken);
        if (response) {
            if (response.code === 'SU') {
                alert('모임이 삭제되었습니다.');
                navigate('/meeting/list');
            }
            if (response.code !== 'SU') {
                alert('모임 삭제에 실패했습니다.');
            } else {
                console.error('Failed to delete meeting:', response.message);
            }
        }
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
                        {(writerNickname === nickname || role === "ADMIN") && (
                            <img className="board-more-button" src="https://i.imgur.com/MzCE4nf.png" alt="더보기" onClick={toggleOptions} />
                        )}
                        {showOptions && (
                            <div className="board-button-box">
                                {writerNickname === nickname && (
                                    <button
                                        className="update-button"
                                        onClick={() => updatePostClickHandler(board?.meetingId)}
                                    >
                                        수정
                                    </button>
                                )}
                                {(writerNickname === nickname || role === "ADMIN") && (
                                    <button
                                        className="delete-button"
                                        onClick={() => deleteMeetingButtonClickHandler(Number(board?.meetingId))}
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                    <img className='board-profile-img' src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' />
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
                    <div key={replyItem.replyId}>
                        <div>
                            <p>프로필 이미지</p>
                            <p>작성자: {replyItem.userDto.nickname}</p>
                            <p>댓글: {replyItem.reply}</p>
                            <p>{formatDate(replyItem.createDate)}</p>
                        </div>
                        <div>
                            {replyItem.replies.map((replyReplyItem) => (
                                <div key={replyReplyItem.replyReplyId} style={{ marginLeft: '20px' }}>
                                    <p>프로필 이미지</p>
                                    <p>작성자: {replyReplyItem.userDto.nickname}</p>
                                    <p>대댓글: {replyReplyItem.replyReply}</p>
                                    <p>{formatDate(replyReplyItem.createDate)}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginLeft: '20px' }}>
                            <input type="text" value={replyReply} onChange={(e) => setReplyReply(e.target.value)} />
                            <button onClick={() => onReplyReplyButtonClickHandler(replyItem.replyId)}>대댓글 작성</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
