import { DeleteAnswerRequest, DeleteQuestionRequest, GetAllAnswerRequest, GetQuestionRequest, PatchAnswerRequest, PostAnswerRequest } from "apis/apis";
import { PostAnswerRequestDto } from "apis/request/answer";
import { DeleteQuestionResponseDto } from "apis/response/question";
import ResponseDto from "apis/response/response.dto";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLoginUserStore from "store/login-user.store";
import Answer from "types/interface/answer.interface";
import Question from "types/interface/question.interface";
import './style.css';
import Meeting from "types/interface/meeting.interface";

const InquireDetail: React.FC = () => {
  const { questionId, answer: answerIdParam } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState<string>("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState<string | null | number>(null);

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const nickname = loginUser?.nickname;
    const role = loginUser?.role;
    if (!nickname || !role) return;
    setNickname(nickname);
    setRole(role);
  }, [loginUser]);

  const updateAnswerList = async () => {
    if(!questionId) return;
    try {
      const response = await GetAllAnswerRequest(questionId);
      if (response && response.code === "SU") {
        setAnswers(response.answers);
      } else {
        console.error("답변 정보를 불러오는 중 오류가 발생했습니다.");
        alert("답변 정보를 불러오는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("답변 정보를 불러오는 중 오류가 발생했습니다:", error);
      alert("답변 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };
  
  useEffect(() => {
    const fetchAnswerDetails = async () => {
      if (!questionId) return;
      try {
        const response = await GetAllAnswerRequest(questionId);
        if (!response) return;
        if (response.code !== "SU") return;
        setAnswers(response.answers);
      } catch (error) {
        console.error("답변 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("답변 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchAnswerDetails();
  }, [questionId]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await GetQuestionRequest(questionId);
        if (!response) return;
        const { title, content, nickname, type, imageList } = response.question;
        if (!title || !content || !nickname || !type) {
          throw new Error("Invalid response structure");
        }
        setQuestion(response.question);
        setLoading(false);
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const updatePostClickHandler = (questionId: number | string | undefined) => {
    if (!questionId) return;
    navigator(`/inquire/update/${questionId}`);
  };

  const getTypeString = (selectedType: string): string => {
    let typeString = "";

    switch (selectedType) {
      case "1":
        typeString = "문의 유형을 선택해주세요.";
        break;
      case "2":
        typeString = "비매너 회원 신고";
        break;
      case "3":
        typeString = "회원정보 안내";
        break;
      case "4":
        typeString = "홈페이지 오류";
        break;
      case "5":
        typeString = "기타 문의";
        break;
      default:
        typeString = "";
        break;
    }

    return typeString;
  };

  const deletePostClickHandler = (questionId: number | string | undefined) => {
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }
    if (!questionId) {
      alert("해당 문의가 없습니다.");
      return;
    }
    DeleteQuestionRequest(questionId).then(deleteQuestionResponse);
  };

  const deleteQuestionResponse = (
    responseBody: DeleteQuestionResponseDto | ResponseDto | null
  ) => {
    if (responseBody && responseBody.code === "SU") {
      alert("해당 문의가 삭제되었습니다.");
      navigator("/inquire/list");
    } else {
      alert("삭제 실패");
    }
  };

  const toggleAnswerSection = () => {
    setAnswerVisible(!answerVisible);
  };

  const handleAnswerContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAnswerContent(event.target.value);
    setContent(event.target.value);
  };

  const uploadAnswerClickHandler = async () => {
    try {
      const result = await PostAnswerRequest({ nickname, content, questionId });
      if (!result) return;
      if (result.code === "SU") {
        await updateAnswerList();
        setContent("");
        setAnswerContent("");
        toggleAnswerSection();
      } else {
        setErrorMessage("댓글 업로드 실패");
      }
    } catch (error) {
      console.error("댓글 업로드 중 오류가 발생했습니다:", error);
      setErrorMessage("댓글 업로드 중 오류가 발생했습니다");
    }
  };

  const deleteAnswerHandler = async (answerId: string | number) => {
    try {
      const response = await DeleteAnswerRequest(answerId);
      if (response && response.code === "SU") {
        setAnswers(answers.filter((answer) => answer.answerId !== answerId));
        alert("댓글이 삭제되었습니다.");
      } else {
        alert("댓글 삭제 실패");
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류가 발생했습니다:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    } finally {
      await updateAnswerList(); 
    }
  };
  
  const startEditingAnswer = (
    answerId: string | number,
    currentContent: string
  ) => {
    setEditingAnswerId(answerId);
    setAnswerContent(currentContent);
  };

  const updateAnswerHandler = async () => {
    if (!editingAnswerId || !questionId) return;
    try {
      const response = await PatchAnswerRequest(editingAnswerId, {
        content: answerContent,
        nickname: nickname,
        questionId: questionId,
      });
      if (response && response.code === "SU") {
        setAnswers(
          answers.map((answer) =>
            answer.answerId === editingAnswerId
              ? { ...answer, content: answerContent }
              : answer
          )
        );
        setEditingAnswerId(null);
        setAnswerContent("");
        alert("댓글이 수정되었습니다.");
      } else {
        alert("댓글 수정 실패");
      }
    } catch (error) {
      console.error("댓글 수정 중 오류가 발생했습니다:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    } finally {
      await updateAnswerList();
    }
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

  if (!question) {
    return <div>질문 정보를 불러오는 데 실패했습니다.</div>;
  }
  const backgoPathClickHandler = () => {
    navigator(`/inquire/list`);
  }
  
  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  // 이미지 넘기기 함수
  const nextImage = () => {
    if (question && question.imageList) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % question.imageList.length);
    }
  };

  const prevImage = () => {
      if (question && question.imageList) {
          setCurrentIndex((prevIndex) => (prevIndex - 1 + question.imageList.length) % question.imageList.length);
      }
  };

  return (
    <div className="question-detail-container">
      <div className="nickname-datetime-container">
        <div className="question-detail-back-button">
          <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backgoPathClickHandler} />
          <p className="nickname">작성자 : {question.nickname}</p>
        </div>
        <p className="createDateTime">{formatDate(question.createDateTime, question.modifyDateTime)}</p>
      </div>

      <div className="title-content-container">
        <div className="more-options">
          {(question.nickname === nickname || role === "ROLE_ADMIN") && (
            <img className="more-button" src="https://i.imgur.com/MzCE4nf.png" alt="더보기" onClick={toggleOptions} />
          )}
          {showOptions && (
            <div className="button-box">
              {question.nickname === nickname && (
                <button
                  className="update-button"
                  onClick={() => updatePostClickHandler(question.questionId)}
                >
                  수정
                </button>
              )}
              {(question.nickname === nickname || role === "ROLE_ADMIN") && (
                <button
                  className="delete-button"
                  onClick={() => deletePostClickHandler(question.questionId)}
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>

        <div className="detail-row">
          <p><span className="label">문의 유형 |</span> <span className="value">{getTypeString(question.type)}</span></p>
          <p><span className="label">제목 |</span> <span className="value">{question.title}</span></p>
          <p><span className="label">내용 |</span> <span className="value">{question.content}</span></p>
        </div>
        <div className="images">
          {question.imageList.map((image, index) => (
            <img
              key={index}
              src={image.image}
              alt={`Meeting image ${index + 1}`}
              className={currentIndex === index ? 'active' : ''}
            />
          ))}
            <button className="images-button left" onClick={prevImage}>◀</button>
            <button className="images-button right" onClick={nextImage}>▶</button>
        </div>
      </div>
      {role === "ADMIN" && (
      <div className="answer-section">
        <button className="add-answer-button" onClick={toggleAnswerSection}>
          {answerVisible ? "답변 닫기" : "답변 작성"}
        </button>
        {answerVisible && (
          <div className="answer-input-container">
            <textarea
              className="answer-input"
              placeholder="댓글을 입력하세요"
              value={answerContent}
              onChange={handleAnswerContentChange}
            ></textarea>
            <button
              className="submit-answer-button"
              onClick={uploadAnswerClickHandler}
            >
              답변 등록
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        )}

        {answers.length === 0 ? (
          <div className="no-answer-message">해당 게시물에 답변이 없습니다.</div>
        ) : (
          answers.map((answer, index) => (
            <div key={index} className="answer">
              <div>{answer.content}</div>
              <div>{answer.createDateTime === answer.modifyDateTime ? formatDate(answer.createDateTime) : formatDate(answer.modifyDateTime)}</div>
              <div className="answer-actions">
                {role === "ADMIN" && (
                  <>
                    <button
                      className="edit-answer-button"
                      onClick={() =>
                        startEditingAnswer(answer.answerId, answer.content)
                      }
                    >
                      답변 수정
                    </button>
                    <button
                      className="delete-answer-button"
                      onClick={() => deleteAnswerHandler(answer.answerId)}
                    >
                      답변 삭제
                    </button>
                  </>
                )}
                {editingAnswerId === answer.answerId && (
                  <div className="edit-answer-container">
                    <textarea
                      className="edit-answer-input"
                      value={answerContent}
                      onChange={handleAnswerContentChange}
                    />
                    {role === "ADMIN" && (
                      <button
                        className="submit-edit-answer-button"
                        onClick={updateAnswerHandler}
                      >
                        수정 완료
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      )}
    </div>
  );
};

export default InquireDetail;
