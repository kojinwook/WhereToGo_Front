// import {
//     DeleteBoardReplyRequest,
//     DeleteMeetingBoardRequest,
//     DeleteMeetingRequest,
//     DeleteReplyReplyRequest,
//     GetBoardReplyRequest,
//     GetMeetingBoardRequest,
//     PostBoardReplyRequest,
//     PostReplyReplyRequest
// } from 'apis/apis';
// import { PostBoardReplyRequestDto, PostReplyReplyRequestDto } from 'apis/request/meeting/board/reply';
// import defaultProfileImage from 'assets/images/user.png';
// import moreButton from 'assets/images/more.png';
// import React, { useEffect, useRef, useState } from 'react';
// import { useCookies } from 'react-cookie';
// import { useNavigate, useParams } from 'react-router-dom';
// import useLoginUserStore from 'store/login-user.store';
// import { BoardReply, MeetingBoard } from 'types/interface/interface';
// import './style.css';
// import SockJS from 'sockjs-client';
// import { Stomp } from '@stomp/stompjs';

// export default function BoardDetail() {
//     const { meetingId, meetingBoardId } = useParams();
//     const { loginUser } = useLoginUserStore();
//     const [board, setBoard] = useState<MeetingBoard>();
//     const [reply, setReply] = useState<string>("");
//     const [replyList, setReplyList] = useState<any[]>([]);
//     const [replyReply, setReplyReply] = useState<string>('');
//     const [cookies] = useCookies();
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [role, setRole] = useState<string>('');
//     const [showBoardOptions, setShowBoardOptions] = useState(false);
//     const [showAnswerOptions, setShowAnswerOptions] = useState<{ [key: number]: boolean }>({});
//     const [showReplyOptions, setShowReplyOptions] = useState<{ [key: number]: boolean }>({});
//     const [replyInputVisibility, setReplyInputVisibility] = useState<{ [key: number]: boolean }>({});
//     const [showModal, setShowModal] = useState<{ [key: string]: boolean }>({});

//     const boardOptionsRef = useRef<HTMLDivElement>(null);
//     const stompClient = useRef<any>(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const socket = new SockJS('http://localhost:8080/ws');
//         stompClient.current = Stomp.over(socket);

//         const headers = {
//             'Authorization': `Bearer ${cookies.accessToken}`
//         };

//         stompClient.current.connect(headers, () => {
//             console.log('WebSocket connected');
//         });

//         return () => {
//             if (stompClient.current) {
//                 stompClient.current.disconnect(() => {
//                     console.log('WebSocket disconnected');
//                 });
//             }
//         };
//     }, [cookies.accessToken]);

//     const formatDate = (createDateTime: string) => {
//         const isoDate = createDateTime;
//         const date = new Date(isoDate);
//         const year = date.getFullYear();
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const day = date.getDate().toString().padStart(2, '0');
//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         let period = hours < 12 ? '오전' : '오후';
//         if (hours === 0) {
//             hours = 12;
//         } else if (hours > 12) {
//             hours -= 12;
//         }
//         return `${year}.${month}.${day}. ${period} ${hours}:${minutes}`;
//     };

//     useEffect(() => {
//         if (loginUser) {
//             setNickname(loginUser.nickname);
//             setRole(loginUser.role);
//         }
//     }, [loginUser]);

//     const fetchReplyList = async () => {
//         if (!meetingBoardId) return;
//         const response = await GetBoardReplyRequest(meetingBoardId);
//         if (!response) return;
//         console.log(response);
//         if (response && response.code === 'SU') {
//             setReplyList(response.replyList);
//         } else {
//             console.error('Failed to fetch reply list');
//         }
//     }

//     useEffect(() => {
//         fetchReplyList();
//     }, [meetingBoardId]);

//     useEffect(() => {
//         if (!meetingBoardId) return;
//         const fetchBoard = async () => {
//             const response = await GetMeetingBoardRequest(meetingBoardId);
//             if (!response) return;
//             if (response && response.code === 'SU') {
//                 setBoard(response.meetingBoard);
//                 setProfileImage(response.meetingBoard.userDto.profileImage);
//                 setWriterNickname(response.meetingBoard.userDto.nickname);
//             } else {
//                 console.error('Failed to fetch board');
//             }
//         }
//         fetchBoard();
//     }, [meetingBoardId]);

//     const onReplyButtonClickHandler = async () => {
//         if (!meetingBoardId || !reply || !nickname || !meetingId) return;
//         const requestBody: PostBoardReplyRequestDto = { meetingBoardId, reply: reply, meetingId: meetingId }
//         const response = await PostBoardReplyRequest(requestBody, cookies.accessToken);
//         if (!response) return;
//         if (response && response.code === 'SU') {
//             alert('댓글이 작성되었습니다.');
//             setReply("");
//             fetchReplyList();

//             if (stompClient.current) {
//                 const notification = {
//                     meetingBoardId: meetingBoardId,
//                     replySender: loginUser?.nickname,
//                     replyContent: reply
//                 };

//                 stompClient.current.send('/app/board/reply',
//                     {
//                         'Authorization': `Bearer ${cookies.accessToken}`
//                     },
//                     JSON.stringify(notification)
//                 );
//                 console.log('WebSocket sent');
//             }

//         } else {
//             console.error('Failed to post reply');
//         }
//     }

//     const onReplyReplyButtonClickHandler = async (parentCommentId: number) => {
//         if (!replyReply || !nickname) return;
//         const requestBody: PostReplyReplyRequestDto = { parentCommentId, replyReply: replyReply }
//         const response = await PostReplyReplyRequest(requestBody, cookies.accessToken);
//         if (!response) return;
//         if (response && response.code === 'SU') {
//             alert('대댓글이 작성되었습니다.');
//             setReplyReply("");
//             fetchReplyList(); // 댓글 리스트를 다시 불러옵니다.
//         } else {
//             console.error('Failed to post reply');
//         }
//     }

//     const backGoPathClickHandler = () => {
//         window.history.back();
//     }

//     // 이미지 넘기기 함수
//     const nextImage = () => {
//         if (board && board.imageList) {
//             setCurrentIndex((prevIndex) => (prevIndex + 1) % board.imageList.length);
//         }
//     };

//     const prevImage = () => {
//         if (board && board.imageList) {
//             setCurrentIndex((prevIndex) => (prevIndex - 1 + board.imageList.length) % board.imageList.length);
//         }
//     };

//     // 더보기
//     const toggleBoardOptions = () => {
//         setShowBoardOptions((prev) => !prev);
//     };

//     const toggleAnswerOptions = (replyId: number) => {
//         setShowAnswerOptions((prev) => ({
//             ...prev,
//             [replyId]: !prev[replyId]
//         }));
//     };

//     const toggleReplyOptions = (replyId: number) => {
//         setShowReplyOptions((prev) => ({
//             ...prev,
//             [replyId]: !prev[replyId]
//         }));
//     };

//     // 수정
//     const updateBoardClickHandler = (meetingBoardId: number | string | undefined) => {
//         console.log("meetingBoardId", meetingBoardId);
//         if (!meetingBoardId) return;
//         navigate(`/meeting/board/update/${meetingId}/${meetingBoardId}`);
//     };

//     const updateAnswerClickHandler = (replyId: number | string | undefined) => {
//         if (!replyId) return;
//         navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
//     };

//     const updateReAnswerClickHandler = (replyReplyId: number | string | undefined) => {
//         if (!replyReplyId) return;
//         navigate(`/meeting/board/detail/${meetingId}/${meetingBoardId}`);
//     };

//     // 삭제
//     const deleteBoardButtonClickHandler = async (meetingBoardId: number) => {
//         window.confirm('정말로 삭제하시겠습니까?')
//         const response = await DeleteMeetingBoardRequest(meetingBoardId, cookies.accessToken);
//         if (!response) return;
//         if (response && response.code === 'SU') {
//             alert('게시물이 삭제되었습니다.');
//             navigate(`/meeting/board/list/${meetingId}`);
//         } else if (response.code === 'DHP') {
//             alert('게시물을 삭제할 수 있는 권한이 없습니다.');
//         } else {
//             console.error('Failed to delete board');
//         }
//     }

//     const deleteAnswerButtonClickHandler = async (replyId: number) => {
//         window.confirm('정말로 삭제하시겠습니까?')
//         const response = await DeleteBoardReplyRequest(replyId, cookies.accessToken);
//         console.log(response);
//         if (!response) return;
//         if (response && response.code === 'SU') {
//             alert('댓글이 삭제되었습니다.');
//             fetchReplyList();
//         } else if (response.code === 'DHP') {
//             alert('댓글을 삭제할 수 있는 권한이 없습니다.');
//         } else {
//             console.error('Failed to delete reply');
//         }
//     }

//     const deleteReAnswerButtonClickHandler = async (replyReplyId: number) => {
//         window.confirm('정말로 삭제하시겠습니까?')
//         const response = await DeleteReplyReplyRequest(replyReplyId, cookies.accessToken);
//         console.log(response);
//         if (!response) return;
//         if (response && response.code === 'SU') {
//             alert('대댓글이 삭제되었습니다.');
//             fetchReplyList();
//         } else if (response.code === 'DHP') {
//             alert('대댓글을 삭제할 수 있는 권한이 없습니다.');
//         } else {
//             console.error('Failed to delete reply reply');
//         }
//     }

//     // 모달 관련 핸들러
//     const openModal = (modalType: string) => {
//         setShowModal((prev) => ({ ...prev, [modalType]: true }));
//     };

//     const closeModal = (modalType: string) => {
//         setShowModal((prev) => ({ ...prev, [modalType]: false }));
//     };

//     return (
//         <div className="board-detail">
//             <button onClick={backGoPathClickHandler}>뒤로가기</button>

//             <div className="board-header">
//                 <h2>{board?.title}</h2>
//                 <button onClick={toggleBoardOptions}>더보기</button>
//                 {showBoardOptions && (
//                     <div ref={boardOptionsRef} className="options-menu">
//                         <button onClick={() => updateBoardClickHandler(board?.meetingBoardId)}>수정</button>
//                         <button onClick={() => deleteBoardButtonClickHandler(board?.meetingBoardId)}>삭제</button>
//                     </div>
//                 )}
//             </div>

//             <div className="board-content">
//                 {board?.imageList && board.imageList.length > 0 && (
//                     <div className="image-slider">
//                         <button onClick={prevImage}>Prev</button>
//                         <img src={board.imageList[currentIndex]} alt="board" />
//                         <button onClick={nextImage}>Next</button>
//                     </div>
//                 )}
//                 <p>{board?.content}</p>
//                 <p>{formatDate(board?.createDate)}</p>
//             </div>

//             <div className="reply-section">
//                 <textarea
//                     value={reply}
//                     onChange={(e) => setReply(e.target.value)}
//                     placeholder="댓글을 입력하세요"
//                 />
//                 <button onClick={onReplyButtonClickHandler}>댓글 작성</button>

//                 {replyList.map((item) => (
//                     <div key={item.replyId} className="reply">
//                         <div className="reply-header">
//                             <img
//                                 src={item.userDto.profileImage || defaultProfileImage}
//                                 alt="profile"
//                                 className="profile-image"
//                             />
//                             <p>{item.userDto.nickname}</p>
//                             <p>{formatDate(item.createDate)}</p>
//                             <button onClick={() => toggleReplyOptions(item.replyId)}>더보기</button>
//                             {showReplyOptions[item.replyId] && (
//                                 <div className="options-menu">
//                                     <button onClick={() => updateAnswerClickHandler(item.replyId)}>수정</button>
//                                     <button onClick={() => deleteAnswerButtonClickHandler(item.replyId)}>삭제</button>
//                                 </div>
//                             )}
//                         </div>
//                         <p>{item.reply}</p>
//                         <button onClick={() => setReplyInputVisibility((prev) => ({
//                             ...prev,
//                             [item.replyId]: !prev[item.replyId]
//                         }))}>
//                             {replyInputVisibility[item.replyId] ? '취소' : '대댓글 작성'}
//                         </button>
//                         {replyInputVisibility[item.replyId] && (
//                             <div className="reply-reply-input">
//                                 <textarea
//                                     value={replyReply}
//                                     onChange={(e) => setReplyReply(e.target.value)}
//                                     placeholder="대댓글을 입력하세요"
//                                 />
//                                 <button onClick={() => onReplyReplyButtonClickHandler(item.replyId)}>작성</button>
//                             </div>
//                         )}
//                         {item.replies && item.replies.map((replyReply) => (
//                             <div key={replyReply.replyReplyId} className="reply-reply">
//                                 <div className="reply-reply-header">
//                                     <img
//                                         src={replyReply.userDto.profileImage || defaultProfileImage}
//                                         alt="profile"
//                                         className="profile-image"
//                                     />
//                                     <p>{replyReply.userDto.nickname}</p>
//                                     <p>{formatDate(replyReply.createDate)}</p>
//                                     <button onClick={() => toggleAnswerOptions(replyReply.replyReplyId)}>더보기</button>
//                                     {showAnswerOptions[replyReply.replyReplyId] && (
//                                         <div className="options-menu">
//                                             <button onClick={() => updateReAnswerClickHandler(replyReply.replyReplyId)}>수정</button>
//                                             <button onClick={() => deleteReAnswerButtonClickHandler(replyReply.replyReplyId)}>삭제</button>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <p>{replyReply.replyReply}</p>
//                             </div>
//                         ))}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import React from 'react'

export default function index() {
  return (
    <div>index</div>
  )
}
