import { DeleteNoticeRequest, GetNoticeRequest } from 'apis/apis';
import { DeleteNoticeResponseDto } from 'apis/response/notice';
import ResponseDto from 'apis/response/response.dto';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import Notice from 'types/interface/notice.interface';

const NoticeDetail: React.FC = () => {

  const { noticeId } = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();
  const [deletingNoticeId, setDeletingNoticeId] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState<string>("");
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const nickname = loginUser?.nickname;
    const role = loginUser?.role;
    // console.log("userId", nickname, "role", role);
    if (!nickname || !role) return;
    setNickname(nickname);
    setRole(role);
    setIsLoggedIn(true);
  }, [loginUser]);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await GetNoticeRequest(noticeId);
        console.log(response)
        if(!response) return;
        const { title, content, nickname, imageList } = response.notice;
        if (!title || !content || !nickname) {
          throw new Error("Invalid response structure");
        }
        setNotice(response.notice);
        setLoading(false);
      } catch (error) {
        console.error("공지사항 정보를 불러오는 중 오류가 발생했습니다.", error);
        // alert("공지사항 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    }
    fetchNotice();
  }, [noticeId]);

  const updatePostClickHandler = (noticeId: number | string | undefined) => {
    if (!noticeId) return;
    navigator(`/notice/update/${noticeId}`);
  }

  const deletePostClickHandler = (noticeId: number | string | undefined) => {
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }
    if (!noticeId) {
      alert("해당 문의가 없습니다.");
      return;
    }
    DeleteNoticeRequest(noticeId).then(deleteNoticeResponse);
  };

  const deleteNoticeResponse = (
    responseBody: DeleteNoticeResponseDto | ResponseDto | null
  ) => {
    if (responseBody && responseBody.code === "SU") {
      alert("해당 문의가 삭제되었습니다.");
      navigator("/notice");
    } else {
      alert("삭제 실패");
    }
    setDeletingNoticeId(null);
  };

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

    return `${year}.${month}.${day}. ${period} ${hours}:${minutes}`;
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!notice) {
    return <div>공지 정보를 불러오는 데 실패했습니다.</div>;
  }
  const backgoPathClickHandler = () => {
    navigator(`/notice`);
  }
  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <div className="question-detail-container">
      <div className="nickname-datetime-container">
        <div className="question-detail-back-button">
          <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backgoPathClickHandler} />
          <p className="nickname">작성자 : {notice.nickname}</p>
        </div>
        <p className="createDateTime">{formatDate(notice.createDateTime, notice.updateDateTime)}</p>
      </div>

      <div className="title-content-container">
        <div className="more-options">
          {(notice.nickname === nickname || role === "ADMIN") && (
            <img className="more-button" src="https://i.imgur.com/MzCE4nf.png" alt="더보기" onClick={toggleOptions} />
          )}
          {showOptions && (
            <div className="button-box">
              {notice.nickname === nickname && (
                <button
                  className="update-button"
                  onClick={() => updatePostClickHandler(notice.noticeId)}
                >
                  수정
                </button>
              )}
              {(notice.nickname === nickname || role === "ADMIN") && (
                <button
                  className="delete-button"
                  onClick={() => deletePostClickHandler(notice.noticeId)}
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>

        <div className="detail-row">

          <p><span className="label">제목 |</span> <span className="value">{notice.title}</span></p>
          <p><span className="label">내용 |</span> <span className="value">{notice.content}</span></p>
        </div>
        <div className='images'>
          {notice.imageList.map((image, index) => (
            <img key={index} src={image.image} alt={`Meeting Image ${index + 1}`} className='meeting-image' />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
