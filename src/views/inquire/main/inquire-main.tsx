import { GetAllNoticeRequest } from "apis/apis";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notice from "types/interface/notice.interface";
import './style.css';
import Question from "types/interface/question.interface";

const Inquire: React.FC = () => {
  const navigator = useNavigate();
  const [posts, setPosts] = useState<Question[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
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
    fetchNotices();
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

  // Limit notices to the first 5 items
  const limitedNotices = notices.slice(0, 5);

  return (
    <div className="inquire">
      <div className="inquire-main">1 : 1 문의</div>
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
            <div>
              <div className="inquire-chat">오픈 채팅</div>
              <button className="inquire-url" onClick={OpenChatClickHandler}>URL</button>
              <div className="inquire-number">고객센터 0000-0000</div>
              <div className="inquire-time">평일 09:00 ~ 18:00 (주말 및 공휴일 휴무)</div>
              <div className="inquire-rest">점심시간 12:00 ~ 13:00</div>
            </div>
            <img src="https://i.imgur.com/bk6ibD5.png" alt="오픈채팅  QR" />
          </div>
        </div>
        <div className="inquire-notice-container">
          <div className="inquire-notice">공지사항</div>
          <button className="inquire-plus" onClick={noticeListClickHandler}>더보기</button>
        </div>
        <div className="inquire-notice-list">
          <div className="inquire-count">{notices.length}건</div>
          <div className="inquire-header">
            <div className="inquire-num">NO</div>
            <div className="inquire-title">제목</div>
            <div className="inquire-date">날짜</div>
          </div>
          {notices.length === 0 ? (
            <div className="inquire-nothing">공지사항이 없습니다.</div>
          ) : (
            <>
              {limitedNotices.map((notice) => (
                <div className="inquire-sort" key={notice.noticeId}>
                  <div className="inquire-num">{notice.noticeId}</div>
                  <div className="inquire-title">{notice.title}</div>
                  <div className="inquire-date">{new Date(notice.createDateTime).toLocaleString()}</div>
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
