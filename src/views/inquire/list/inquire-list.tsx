import { GetAllQuestionRequest } from "apis/apis";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Question from "types/interface/question.interface";
import Pagination from "components/Pagination";
import './style.css';
import useLoginUserStore from "store/login-user.store";

const InquireList: React.FC = () => {
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();
  const { questionId } = useParams();
  const [posts, setPosts] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2; // 페이지당 항목 수
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPosts = posts.slice(startIndex, endIndex);

  const nickname = loginUser?.nickname;
  const role = loginUser?.role;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await GetAllQuestionRequest();
        console.log(result);
        if (!result) return;
        const { code, questions } = result;
        if (code === 'DBE') {
          alert('데이터베이스 오류입니다.');
          return;
        }
        if (code !== 'SU') return;

        const filteredQuestions = role === "ROLE_ADMIN" ? questions : questions.filter((question: Question) =>
          question.nickname === nickname
        );

        const sortedQuestions = filteredQuestions.sort((a: Question, b: Question) =>
          new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime()
        );

        setPosts(sortedQuestions);
        setLoading(false);
      } catch (error) {
        console.error('문의 목록을 가져오는데 실패했습니다.', error);
      }
    };

    fetchPosts();
  }, [questionId, nickname, role]);

  const formatDate = (isoDate: string) => {
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

  const inquireListClickHandler = (questionId: number | string | undefined) => {
    navigator(`/inquire/detail/${questionId}`);
  };

  const backPathClickHandler = () => {
    navigator(`/inquire`);
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case '1':
        return '문의 유형을 선택해주세요.';
      case '2':
        return '비매너 회원 신고';
      case '3':
        return '회원정보 안내';
      case '4':
        return '홈페이지 오류';
      case '5':
        return '기타 문의';
      default:
        return '';
    }
  };

  return (
    <div className="inquire-list">
      <h1>문의 리스트</h1>
      <div className="back-button">
        <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backPathClickHandler} />
      </div>
      <div className='inquire-list-header'>
        <div>NO</div>
        <div>문의 유형</div>
        <div>제목</div>
        <div>날짜</div>
        <div>답변 유/무</div>
      </div>

      <div className="inquire-list-body">
        {posts.length === 0 ? (
          <p className="posts-zero">문의 목록이 없습니다.</p>
        ) : (
          <div className="posts">
            {displayedPosts.map((post, index) => (
              <div className="post" key={post.questionId} onClick={() => inquireListClickHandler(post.questionId)}>
                <p>{posts.length - startIndex - index}</p>
                <p>{getTypeText(post.type)}</p>
                <p onClick={() => inquireListClickHandler(post.questionId)}>
                  {post.title}
                </p>
                <p>{post.modifyDateTime ? formatDate(post.modifyDateTime) : formatDate(post.createDateTime)}</p>
                <p>{post.answered ? '유' : '무'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pagination-box">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          viewPageList={Array.from({ length: Math.ceil(posts.length / itemsPerPage) }, (_, i) => i + 1)}
        />
      </div>
    </div>
  );
};

export default InquireList;
