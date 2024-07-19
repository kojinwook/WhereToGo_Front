import { DeleteMeetingBoardRequest, GetBoardReplyRequest, GetMeetingBoardRequest, PostBoardReplyRequest, PostReplyReplyRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { BoardReply, MeetingBoard } from 'types/interface/interface';
import defaultProfileImage from 'assets/images/user.png';
import { useCookies } from 'react-cookie';
import { PostBoardReplyRequestDto, PostReplyReplyRequestDto } from 'apis/request/meeting/board/reply';
import useLoginUserStore from 'store/login-user.store';

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
    const navigate = useNavigate();

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

    return (
        <div>
            <h1>Board Detail</h1>
            {board && (
                <div>
                    프로필이미지: <img src={profileImage ? profileImage : defaultProfileImage} alt='프로필 이미지' />
                    <p>닉네임: {writerNickname}</p>
                    <ul>사진:
                        {board.imageList.map((image, index) => (
                            <li key={index}>
                                <img src={image.image} alt="image" />
                            </li>
                        ))}
                    </ul>
                    <p>제목: {board.title}</p>
                    <p>주소: {board.address}</p>
                    <p>내용: {board.content}</p>
                    <div>
                        <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} />
                        <button onClick={onReplyButtonClickHandler}>댓글 작성</button>
                    </div>
                </div>
            )}

            <div>
                {replyList.map((replyItem) => (
                    <div key={replyItem.replyId}>
                        <div>
                            {/* <p>{replyItem.userDto.nickname}</p> */}
                            <p>{replyItem.reply}</p>
                            {/* <p>{replyItem.createDate}</p> */}
                        </div>
                        <div>
                            {replyItem.replies.map((replyReplyItem) => (
                                <div key={replyReplyItem.replyReplyId} style={{ marginLeft: '20px' }}>
                                    <p>{replyReplyItem.userDto.nickname}</p>
                                    <p>{replyReplyItem.reply}</p>
                                    <p>{replyReplyItem.createDate}</p>
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
