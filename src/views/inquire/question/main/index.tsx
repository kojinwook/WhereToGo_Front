import { getAllQuestionRequest } from "apis/apis"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import Question from "types/interface/question.interface"

const QuestionList: React.FC = () => {
  const { questionId } = useParams();
  const navigator = useNavigate();
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
  }, []);

  const writePathClickHandler = () => {
    navigator('/question/write');
  }


  return (
    <div>
      <div> 1 : 1 문의 </div>
      <div>
        <div>
          <div>
            <div>
              <div onClick={writePathClickHandler}> 1 : 1 문의 접수 </div>
              <div> 1 : 1 문의 내역 </div>
            </div>
            <div>
              <div> 오픈 채팅 </div>
              <div> URL </div>
              <div> 고객센터 0000-0000 </div>
              <div> 평일 09:00 ~ 18:00 </div>
              <div> 점심시간 12:00 ~ 13:00 </div>
            </div>
          </div>
          <div> 공지사항 </div>
          <div> 더보기 </div>
          <div></div>
        </div>
      </div>
    </div>
  )







}

export default QuestionList;
