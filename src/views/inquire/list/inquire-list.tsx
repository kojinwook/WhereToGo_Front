import { getAllQuestionRequest } from "apis/apis";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Question from "types/interface/question.interface";
import './style.css';

const InquireList: React.FC = () => {
  const navigator = useNavigate();
  const { questionId } = useParams();
  const [posts, setPosts] = useState<Question[]>([]);
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

    fetchPosts();
  }, [questionId]);

  // ISO 8601 포맷의 날짜를 포맷팅하는 함수
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    let period = hours < 12 ? '오전' : '오후';

    // 시간 형식 수정: 12시를 넘어갈 때 오후로 표시하고 12를 기준으로 수정
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    return `${year}.${month}.${day}. ${period} ${hours}:${minutes}`;
  };

  const inquireListClickHandler = (questionId: number | string | undefined) => {
    navigator(`/inquire/detail/${questionId}`);
  }


  return (
    <div className="inquire-list">
      <h1>문의 리스트</h1>
      <div className='inquire-header'>
        <div>NO</div>
        <div>문의 유형</div>
        <div>제목</div>
        <div>날짜</div>
        <div>답변 유/무</div>
      </div>
      
      <div className="inquire-list-body">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="posts">
            {posts.map((post, index) => (
              <div className="post" key={post.questionId}>
                <p>{index + 1}</p>
                <p>{getTypeText(post.type)}</p>
                <p onClick={() =>inquireListClickHandler(post.questionId)}>{post.title}</p>
                <p>{formatDate(post.createDateTime)}</p>
                <p>{Array.isArray(post.answers) && post.answers.length > 0 ? '유' : '무'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 유형 번호를 텍스트로 변환하는 함수
const getTypeText = (type: string) => {
  switch (type) {
    case "1":
      return "문의 유형을 선택해주세요.";
    case "2":
      return "비매너 회원 신고";
    case "3":
      return "회원정보 안내";
    case "4":
      return "홈페이지 오류";
    case "5":
      return "기타 문의";
    default:
      return "";
  }
};

export default InquireList;
