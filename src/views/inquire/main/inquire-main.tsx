import { getAllQuestionRequest, getAllNoticeRequest } from "apis/apis" // 공지사항 데이터 가져오기 위해 추가
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Question from "types/interface/question.interface"
import Notice from "types/interface/notice.interface" // 공지사항 인터페이스 가져오기 위해 추가

const InquireList: React.FC = () => {
  const { questionId } = useParams();
  const navigator = useNavigate();
  const [posts, setPosts] = useState<Question[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]); // 공지사항 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllQuestionRequest();
        if (!result) return;
        const { code, questions } = result;
        if (code === 'DBE') {
          alert('데이터베이스 오류입니다.');
          return;
        }
        if (code !== 'SU') return;
        setPosts(questions);
        setLoading(false);
      } catch (error) {
        console.error('문의 목록을 가져오는데 실패했습니다.', error);
      }
    };

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

    fetchPosts();
    fetchNotices(); // 공지사항 데이터 호출 추가
  }, []);

  const writePathClickHandler = () => {
    navigator(`/inquire/write`);
  }
  const ListPathClickHandler = () => {
    navigator(`/inquire/list`);
  }
  const OpenChatClickHandler = () => {
    navigator(`/`);
  }
  const noticeListClickHandler = () => {
    navigator(`/notice/main`);
  }

  return (
    <div>
      <div> 1 : 1 문의 </div>
      <div>
        <div>
          <div>
            <div>
              <button onClick={writePathClickHandler}> 1 : 1 문의 접수 </button>
              <button onClick={ListPathClickHandler}> 1 : 1 문의 목록 </button>
            </div>
            <div>
              <div> 오픈 채팅 </div>
              <button onClick={OpenChatClickHandler}> URL</button>
              <div> 고객센터 0000-0000 </div>
              <div> 평일 09:00 ~ 18:00 </div>
              <div> 점심시간 12:00 ~ 13:00 </div>
            </div>
          </div>
          <div> 공지사항 </div>
          <button onClick={noticeListClickHandler}> 더보기 </button>
          <div>
            {notices.map((notice) => (
              <div key={notice.noticeId}>
                <span>{notice.noticeId}</span>
                <span>{notice.title}</span>
                {/* <span>{notice.createDateTime}</span> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InquireList;
