import { getAllQuestionRequest, getAllNoticeRequest } from "apis/apis" // 공지사항 데이터 가져오기 위해 추가
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Question from "types/interface/question.interface"
import Notice from "types/interface/notice.interface" // 공지사항 인터페이스 가져오기 위해 추가
import './style.css'

const Inquire: React.FC = () => {
  // const { questionId } = useParams();
  const navigator = useNavigate();
  const [posts, setPosts] = useState<Question[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]); // 공지사항 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => { // 공지사항 데이터 가져오기
      try {
        const result = await getAllNoticeRequest();
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
    navigator(`/notice/main`);
  }

  return (
    <div className="inquire">
      <div className="inquire-main"> 1 : 1 문의 </div>

        <div className="inquire-enter">
          <div className="inquire-question">
            <div className="inquire-left">
              <button className="inquire-apply" onClick={writePathClickHandler}> 1 : 1 문의 접수 </button>
              <button className="inquire-list" onClick={ListPathClickHandler}> 1 : 1 문의 목록 </button>
            </div>
            <div className="inquire-right">
              <div className="inquire-chat"> 오픈 채팅 </div>
              <button className="inquire-url" onClick={OpenChatClickHandler}> URL</button>
              <div className="inquire-number" > 고객센터 0000-0000 </div>
              <div className="inquire-time"> 평일 09:00 ~ 18:00 </div>
              <div className="inquire-rest"> 점심시간 12:00 ~ 13:00 </div>
            </div>
          </div>
          <div className="inquire-notice"> 공지사항 </div>
          <button className="inquire-plus" onClick={noticeListClickHandler}> 더보기 </button>
          <div className="inquire-notice-list">
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
                <div className="inquire-count">{notices.length}건</div> {/* 공지사항 수 표시 */}
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default Inquire;
