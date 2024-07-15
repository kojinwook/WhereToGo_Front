import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllQuestionRequest } from 'apis/apis';
import Question from 'types/interface/question.interface';

const InquireList: React.FC = () => {
  const navigator = useNavigate();
  const { questionId } = useParams();
  const [posts, setPosts] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllQuestionRequest();
        console.log(result);
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

console.log(posts)

  return (
    <div className="inquire-list">
      <h1>문의 리스트</h1>
      {loading ? (
        <p>문의 목록이 없습니다.</p>
      ) : (
        <div className="posts">
          {posts.map((post, index) => (
            <div className="post" key={post.questionId}>
              <p>{index + 1}</p>
              <p>유형: {getTypeText(post.type)}</p>
              <p onClick={() => inquireListClickHandler(post.questionId)}>
                제목: {post.title}
              </p>
              <p>작성 일시: {formatDate(post.createDateTime)}</p>
              <p>수정 일시: {formatDate(post.modifyDateTime)}</p>
              {/* <p>답변: {post.answers && Array.isArray(post.answers) && post.answers.length > 0 ? '유' : '무'}</p> */}
              <p>답변: {post.answered ? '유' : '무'}</p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquireList;
