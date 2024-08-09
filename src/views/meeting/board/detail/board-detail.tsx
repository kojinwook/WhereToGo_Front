import { DeleteBoardReplyRequest, DeleteMeetingBoardRequest, DeleteReplyReplyRequest, GetBoardReplyRequest, GetMeetingBoardRequest, PatchBoardReplyRequest, PatchReplyReplyRequest, PostBoardReplyRequest, PostReplyReplyRequest } from 'apis/apis';
import { PatchBoardReplyRequestDto, PatchReplyReplyRequestDto, PostBoardReplyRequestDto, PostReplyReplyRequestDto } from 'apis/request/meeting/board/reply';
import defaultProfileImage from 'assets/images/user.png';
import moreButton from 'assets/images/more.png';
import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { BoardReply, MeetingBoard } from 'types/interface/interface';
import './style.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

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
    const [showBoardOptions, setShowBoardOptions] = useState(false);
    const [showAnswerOptions, setShowAnswerOptions] = useState<{ [key: number]: boolean }>({});
    const [showReplyOptions, setShowReplyOptions] = useState<{ [key: number]: boolean }>({});
    const [replyInputVisibility, setReplyInputVisibility] = useState<{ [key: number]: boolean }>({});

    const [editReplyId, setEditReplyId] = useState<number | null>(null);
    const [editReplyReplyId, setEditReplyReplyId] = useState<number | null>(null);
    const [editedReply, setEditedReply] = useState<string>('');
    const [editedReplyReply, setEditedReplyReply] = useState<string>('');


    const stompClient = useRef<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const socket = new SockJS('http://15.165.24.165:8088/ws');
        stompClient.current = Stomp.over(socket);

        const headers = {
            'Authorization': `Bearer ${cookies.accessToken}`
        };

        stompClient.current.connect(headers, () => {
            console.log('WebSocket connected');
        });

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect(() => {
                    console.log('WebSocket disconnected');
                });
            }
        };
    }, [cookies.accessToken]);

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
            setRole(loginUser.role);
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
        if (!meetingBoardId || !reply || !nickname || !meetingId) return;
        if (!cookies.accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }
        const requestBody: PostBoardReplyRequestDto = { meetingBoardId, reply: reply, meetingId: meetingId }
        const response = await PostBoardReplyRequest(requestBody, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('댓글이 작성되었습니다.');
            setReply("");
            fetchReplyList();

            if (stompClient.current) {
                const notification = {
                    meetingBoardId: meetingBoardId,
                    replySender: loginUser?.nickname,
                    replyContent: reply
                };

                stompClient.current.send('/app/board/reply',
                    {
                        'Authorization': `Bearer ${cookies.accessToken}`
                    },
                    JSON.stringify(notification)
                );
                console.log('WebSocket sent');
            }

        } else {
            console.error('Failed to post reply');
        }
    }

    const onReplyReplyButtonClickHandler = async (parentCommentId: number) => {
        if (!replyReply || !nickname) return;
        if (!cookies.accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }
        const requestBody: PostReplyReplyRequestDto = { parentCommentId, replyReply: replyReply }
        const response = await PostReplyReplyRequest(requestBody, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('대댓글이 작성되었습니다.');
            setReplyReply("");
            fetchReplyList();
        } else {
            console.error('Failed to post reply');
        }
    }

    const backGoPathClickHandler = () => {
        window.history.back();
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
    const toggleBoardOptions = () => {
        setShowBoardOptions((prev) => !prev);
    };

    const toggleAnswerOptions = (replyId: number) => {
        setShowAnswerOptions((prev) => ({
            ...prev,
            [replyId]: !prev[replyId]
        }));
    };

    const toggleReplyOptions = (replyReplyId: number) => {
        setShowReplyOptions((prev) => ({
            ...prev,
            [replyReplyId]: !prev[replyReplyId]
        }));
    };

    // 수정
    const updateBoardClickHandler = (meetingBoardId: number | string | undefined) => {
        console.log("meetingBoardId", meetingBoardId);
        if (!meetingBoardId) return;
        navigate(`/meeting/board/update/${meetingId}/${meetingBoardId}`);
    };

    const onEditReplyButtonClickHandler = (replyId: number, currentReply: string) => {
        setEditReplyId(replyId);
        setEditedReply(currentReply);
    };

    const onEditReplyReplyButtonClickHandler = (replyReplyId: number, currentReplyReply: string) => {
        setEditReplyReplyId(replyReplyId);
        setEditedReplyReply(currentReplyReply);
    };

    const onEditReplySubmitHandler = async (replyId: number) => {
        const requestBody: PatchBoardReplyRequestDto = { replyId, reply: editedReply };
        const response = await PatchBoardReplyRequest(requestBody, cookies.accessToken);
        if (response && response.code === 'SU') {
            alert('댓글이 수정되었습니다.');
            setEditReplyId(null);
            setEditedReply('');
            fetchReplyList();
        }
    };

    const onEditReplyReplySubmitHandler = async (replyReplyId: number) => {
        const requestBody: PatchReplyReplyRequestDto = { replyReplyId: replyReplyId, replyReply: editedReplyReply };
        const response = await PatchReplyReplyRequest(requestBody, cookies.accessToken);
        if (response && response.code === 'SU') {
            alert('대댓글이 수정되었습니다.');
            setEditReplyReplyId(null);
            setEditedReplyReply('');
            fetchReplyList();
        }
    };

    // 삭제
    const deleteBoardButtonClickHandler = async (meetingBoardId: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteMeetingBoardRequest(meetingBoardId, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('게시물이 삭제되었습니다.');
            navigate(`/meeting/detail/${meetingId}`);
        } else if (response.code === 'DHP') {
            alert('게시물을 삭제할 수 있는 권한이 없습니다.');
        } else {
            console.error('Failed to delete board');
        }
    }

    const deleteAnswerButtonClickHandler = async (replyId: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteBoardReplyRequest(replyId, cookies.accessToken);
        console.log(response);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('댓글이 삭제되었습니다.');
            fetchReplyList();
        } else if (response.code === 'DHP') {
            alert('댓글을 삭제할 수 있는 권한이 없습니다.');
        } else {
            console.error('Failed to delete reply');
        }
    }

    const deleteReAnswerButtonClickHandler = async (replyReplyId: number) => {
        window.confirm('정말로 삭제하시겠습니까?')
        const response = await DeleteReplyReplyRequest(replyReplyId, cookies.accessToken);
        if (!response) return;
        if (response && response.code === 'SU') {
            alert('대댓글이 삭제되었습니다.');
            fetchReplyList();
        } else if (response.code === 'DHP') {
            alert('대댓글을 삭제할 수 있는 권한이 없습니다.');
        } else {
            console.error('Failed to delete replyReply');
        }
    }

    // 댓글
    const handleCommentSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 Enter 동작 방지
            await onReplyButtonClickHandler(); // 댓글 등록 함수 호출
        }
    };

    // 대댓글
    const toggleReplyInputVisibility = (replyId: number) => {
        setReplyInputVisibility(prevState => ({
            ...prevState,
            [replyId]: !prevState[replyId]
        }));
    };

    const handleReplySubmit = async (e: React.KeyboardEvent<HTMLInputElement>, replyId: number) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 Enter 동작 방지
            await onReplyReplyButtonClickHandler(replyId); // 대댓글 등록 함수 호출
        }
    };

    // 신고버튼
    const reportUserButtonClickHandler = (reportUserNickname: string | undefined) => {
        navigate(`/user/report/${reportUserNickname}`);
    }

    return (
        <div className='board-detail-container'>
            <div className='board-detail-header'>
                <div className='board-detail-name'>
                    <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backGoPathClickHandler} />
                </div>
                <img
                    className='festival-detail-sharing'
                    src="https://i.imgur.com/hA50Ys8.png"
                    alt="공유"
                    onClick={() => {
                        const textarea = document.createElement('textarea');
                        textarea.value = window.location.href;
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                            document.execCommand('copy');
                            alert('링크가 복사되었습니다!'); // 성공 메시지
                        } catch (err) {
                            console.error('링크 복사 실패:', err);
                            alert('링크 복사에 실패했습니다. 다시 시도해 주세요.');
                        }
                        document.body.removeChild(textarea);
                    }}
                />

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
                        <div className="profile-container">
                            <img className='board-profile-img' src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' />
                            <p className="writer-nickname">{writerNickname}</p>
                        </div>

                        <img className="board-more-button" src={moreButton} alt="더보기" onClick={toggleBoardOptions} />
                        {showBoardOptions && (
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
                                <button
                                    className="report-button"
                                    onClick={() => reportUserButtonClickHandler(board?.userDto.nickname)}
                                >
                                    신고
                                </button>
                            </div>
                        )}
                    </div>
                    <div className='board-detail-info'>
                        <p>제목</p>
                        {board?.title ? <div className="board-info-div">{board.title}</div> : <div className="board-info-non-div">{'제목이 없습니다'}</div>}
                        <p>주소</p>
                        {board?.address ? <div className="board-info-div">{board.address}</div> : <div className="board-info-non-div">{'주소가 없습니다'}</div>}
                        <p>내용</p>
                        {board?.content ? <div className="board-info-div">{board.content}</div> : <div className="board-info-non-div">{'내용이 없습니다'}</div>}
                    </div>
                </div>
            </div>

            <div className='board-answer'>
                <div className='board-answer-add'>
                    <input className='board-answer-input' type="text" value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={handleCommentSubmit} />
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
                                    <img className="board-more-button" src={moreButton} alt="더보기" onClick={() => toggleAnswerOptions(replyItem.replyId)} />
                                    {showAnswerOptions[replyItem.replyId] && (
                                        <div className="board-button-box">
                                            {replyItem.userDto.nickname === nickname && (
                                                <button
                                                    className="update-button"
                                                    onClick={() => onEditReplyButtonClickHandler(replyItem.replyId, replyItem.reply)}
                                                >
                                                    수정
                                                </button>
                                            )}
                                            {(replyItem.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
                                                <button
                                                    className="delete-button"
                                                    onClick={() => deleteAnswerButtonClickHandler(replyItem.replyId)}
                                                >
                                                    삭제
                                                </button>
                                            )}
                                            <button
                                                className="report-button"
                                                onClick={() => reportUserButtonClickHandler(replyItem?.userDto.nickname)}
                                            >
                                                신고
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {editReplyId === replyItem.replyId ? (
                                <div className='edit-reply-input'>
                                    <input className='board-answer-input'
                                        type='text'
                                        value={editedReply}
                                        onChange={(e) => setEditedReply(e.target.value)}
                                    />
                                    <button className='board-answer-btn' onClick={() => onEditReplySubmitHandler(replyItem.replyId)}>수정 완료</button>
                                </div>
                            ) : (
                                <div className='answer-reply-content'>{replyItem.reply}</div>
                            )}
                            <div className='answer-reply-reply'>
                                <button
                                    className='answer-reply-reply-btn'
                                    onClick={() => toggleReplyInputVisibility(replyItem.replyId)}
                                >
                                    {replyInputVisibility[replyItem.replyId] ? '취소' : '대댓글 작성'}
                                </button>
                                {replyInputVisibility[replyItem.replyId] && (
                                    <div className='answer-reply-reply-input'>
                                        <input
                                            className='answer-reply-reply-input-field'
                                            type="text"
                                            value={replyReply}
                                            onChange={(e) => setReplyReply(e.target.value)}
                                            onKeyDown={(e) => handleReplySubmit(e, replyItem.replyId)}
                                        />
                                        <button
                                            className='answer-reply-reply-submit-btn'
                                            onClick={() => onReplyReplyButtonClickHandler(replyItem.replyId)}
                                        >
                                            대댓글 등록
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className='board-replies'>
                                {replyItem.replies.map((replyReplyItem) => (
                                    <div key={replyReplyItem.replyReplyId} className='board-reply-reply-item'>
                                        <div className='board-answer-header'>
                                            <img className='answer-profile-img' src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' />
                                            <p className='answer-nickname'>{replyReplyItem.userDto.nickname}</p>
                                            <div className='answer-date'>{formatDate(replyReplyItem.createDate)}</div>

                                            <div className="answer-more-options">
                                                <img className="board-more-button" src={moreButton} alt="더보기" onClick={() => toggleReplyOptions(replyReplyItem.replyReplyId)} />
                                                {showReplyOptions[replyReplyItem.replyReplyId] && (
                                                    <div className="board-button-box">
                                                        {replyReplyItem.userDto.nickname === nickname && (
                                                            <button
                                                                className="update-button"
                                                                onClick={() => onEditReplyReplyButtonClickHandler(replyReplyItem.replyReplyId, replyReplyItem.replyReply)}
                                                            >
                                                                수정
                                                            </button>
                                                        )}
                                                        {(replyReplyItem.userDto.nickname === nickname || role === "ROLE_ADMIN") && (
                                                            <button
                                                                className="delete-button"
                                                                onClick={() => deleteReAnswerButtonClickHandler(replyReplyItem.replyReplyId)}
                                                            >
                                                                삭제
                                                            </button>
                                                        )}
                                                        <button
                                                            className="report-button"
                                                            onClick={() => reportUserButtonClickHandler(replyReplyItem.userDto.nickname)}
                                                        >
                                                            신고
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {editReplyReplyId === replyReplyItem.replyReplyId ? (
                                            <div className='edit-reply-reply-input'>
                                                <input className='board-answer-input'
                                                    type='text'
                                                    value={editedReplyReply}
                                                    onChange={(e) => setEditedReplyReply(e.target.value)}
                                                />
                                                <button className='board-answer-btn' onClick={() => onEditReplyReplySubmitHandler(replyReplyItem.replyReplyId)}>수정 완료</button>
                                            </div>
                                        ) : (
                                            <p className='answer-reply-content'>{replyReplyItem.replyReply}</p>
                                        )}
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