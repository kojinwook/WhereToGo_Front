import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostAnswerRequestDto } from "apis/request/answer";
import { DeleteQuestionResponseDto } from "apis/response/question";
import Answer from "types/interface/answer.interface";
import Question from "types/interface/question.interface";
import useLoginUserStore from "store/login-user.store";
import {
  deleteAnswerRequest,
  deleteQuestionRequest,
  getAnswerRequest,
  getQuestionRequest,
  patchAnswerRequest,
  postAnswerRequest,
} from "apis/apis";
import ResponseDto from "apis/response/response.dto";

const InquireDetail: React.FC = () => {
  const { questionId, answer: answerIdParam } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const navigator = useNavigate();
  const { loginUser } = useLoginUserStore();
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<string>("");
  const [content, setContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [postRequest, setPostRequest] = useState<PostAnswerRequestDto>({
    content: "",
    userId: "",
    questionId,
  });

  const [answerVisible, setAnswerVisible] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState<string | null | number>(null);

  useEffect(() => {
    const userId = loginUser?.userId;
    const role = loginUser?.role;
    console.log("userId", userId, "role", role);
    if (!userId || !role) return;
    setUserId(userId);
    setRole(role);
    setIsLoggedIn(true);
  }, [loginUser]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionRequest(questionId);
        const { title, content, userId, type, image } = response as Question;
        if (!title || !content || !userId || !type) {
          throw new Error("Invalid response structure");
        }
        setQuestion(response as Question);
        setLoading(false);
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      if (!questionId) return;
      try {
        const response = await getAnswerRequest(questionId);
        if (response.code !== "SU") return;
        setAnswers(response.answer);
      } catch (error) {
        console.error("답변 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("답변 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchAnswerDetails();
  }, [answerIdParam]);

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
        typeString = ""; // 기본값 처리
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
    deleteQuestionRequest(questionId).then(deleteQuestionResponse);
  };

  const deleteQuestionResponse = (
    responseBody: DeleteQuestionResponseDto | ResponseDto | null
  ) => {
    if (responseBody && responseBody.code === "SU") {
      alert("해당 문의가 삭제되었습니다.");
      navigator("/question");
    } else {
      alert("삭제 실패");
    }
    setDeletingQuestionId(null);
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
      const result = await postAnswerRequest({ userId, content, questionId });
      if (!result) return;
      if (result && result.code === "SU") {
        alert("댓글이 업로드되었습니다.");
        setAnswers([
          ...answers,
          {
            content,
            userId,
            answerId: "",
            questionId: "",
            createDateTime: "",
            modifyDateTime: "",
          },
        ]); // 새로운 댓글 추가
        setContent("");
        setAnswerContent("");
        toggleAnswerSection(); // 모달 닫기
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
      const response = await deleteAnswerRequest(answerId);
      if (response && response.code === "SU") {
        setAnswers(answers.filter((answer) => answer.answerId !== answerId));
        alert("댓글이 삭제되었습니다.");
      } else {
        alert("댓글 삭제 실패");
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류가 발생했습니다:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
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
    if (!editingAnswerId) return;
    try {
      const response = await patchAnswerRequest(editingAnswerId, {
        content: answerContent,
        userId: "",
        questionId: "",
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
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!question) {
    return <div>질문 정보를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="question-detail-container">
      <div className="title-content-container">
        <div className="title">{question.title}</div>
        <div className="content">{question.content}</div>
        {question.image && (
          <div className="image-container">
            <img src={question.image} alt="질문 이미지" />
          </div>
        )}
      </div>
      <div className="title-content-container">
        <div className="type">{getTypeString(question.type)}</div>
      </div>
      <div className="button-box">
        {question.userId === userId && (
          <button
            className="update-button"
            onClick={() => updatePostClickHandler(question.questionId)}
          >
            수정
          </button>
        )}
        {(question.userId === userId || role === "ADMIN") && (
          <button
            className="delete-button"
            onClick={() => deletePostClickHandler(question.questionId)}
          >
            삭제
          </button>
        )}
      </div>

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
              댓글 등록
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        )}

        {answers.map((answer, index) => (
          <div key={index} className="answer">
            <div>{answer.content}</div>
            <div className="answer-actions">
              {role === "ADMIN" && (
                <>
                  <button
                    className="edit-answer-button"
                    onClick={() =>
                      startEditingAnswer(answer.answerId, answer.content)
                    }
                  >
                    수정
                  </button>
                  <button
                    className="delete-answer-button"
                    onClick={() => deleteAnswerHandler(answer.answerId)}
                  >
                    삭제
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
                  <button
                    className="submit-edit-answer-button"
                    onClick={updateAnswerHandler}
                  >
                    수정 완료
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquireDetail;
