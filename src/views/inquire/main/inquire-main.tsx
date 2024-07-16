import { GetAllNoticeRequest } from "apis/apis"; // 공지사항 데이터 가져오기 위해 추가
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notice from "types/interface/notice.interface"; // 공지사항 인터페이스 가져오기 위해 추가
import Question from "types/interface/question.interface";
import './style.css';

const Inquire: React.FC = () => {
  // const { questionId } = useParams();
  const navigator = useNavigate();
  const [posts, setPosts] = useState<Question[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]); // 공지사항 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => { // 공지사항 데이터 가져오기
      try {
        const result = await GetAllNoticeRequest();
        if (!result) return;
        const { code, notices } = result;
        if (code === 'DBE') {
          alert('데이터베이스 오류입니다.');
          return;
        }
        if (code !== 'SU') return;
        setNotices(notices);
      } catch (error) {
        console.error('공지사항을 가져오는데 실패했습니다.', error);
      }
    };
    fetchNotices(); // 공지사항 데이터 호출 추가
  }, []);

  const writePathClickHandler = () => {
    navigator(`/inquire/write`);
  }
  const ListPathClickHandler = () => {
    navigator(`/inquire/list`);
  }
    const OpenChatClickHandler = () => {
      window.location.href = 'https://open.kakao.com/o/sZv3FqCg';
    }
  const noticeListClickHandler = () => {
    navigator(`/notice`);
  }
  const backPathClickHandler = () => {
    navigator(`/`);
  }

  return (
    <div className="inquire">
      <div className="inquire-main"> 1 : 1 문의 </div>
        <div onClick={backPathClickHandler}>취소</div>
        <div className="inquire-enter">
          <div className="inquire-question">
            <div className="inquire-left">
              <div className="list-left">
                  <button className="inquire-apply" onClick={writePathClickHandler}>1 : 1<br />문의 접수</button>
              </div>
              <div className="inquire-divider"></div>
              <div className="list-right">
                  <button className="inquire-li" onClick={ListPathClickHandler}>1 : 1<br />문의 내역</button>
              </div>
            </div>
            <div className="inquire-right">
              <div className="inquire-chat"> 오픈 채팅 </div>
              <button className="inquire-url" onClick={OpenChatClickHandler}> URL</button>
              <div className="inquire-number" > 고객센터 0000-0000 </div>
              <div className="inquire-time"> 평일 09:00 ~ 18:00 (주말 및 공휴일 휴무) </div>
              <div className="inquire-rest"> 점심시간 12:00 ~ 13:00 </div>
            </div>
          </div>
          <div className="inquire-notice-container">
            <div className="inquire-notice"> 공지사항 </div>
            <button className="inquire-plus" onClick={noticeListClickHandler}> 더보기 </button>
          </div>
          <div className="inquire-notice-list">
          <div className="inquire-count">{notices.length}건</div> {/* 공지사항 수 표시 */}
            <div className="inquire-header">
              <span className="inquire-num">NO</span>
              <span className="inquire-title">제목</span>
              <span className="inquire-date">날짜</span>
            </div>
            {notices.length === 0 ? (
              <div className="inquire-nothing">공지사항이 없습니다.</div>
            ) : (
              <>
                {notices.map((notice) => (
                  <div className="inquire-sort" key={notice.noticeId}>
                    <span>{notice.noticeId}</span>
                    <span>{notice.title}</span>
                    <span>{new Date(notice.createDateTime).toLocaleString()}</span> {/* 작성된 시간을 표시 */}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default Inquire;
