import { getQuestionRequest, postQuestionRequest } from 'apis/apis';
import { PostQuestionRequestDto } from 'apis/request/question';
import QuestionData from 'apis/request/question/questiondata.request.dto';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Cookies, useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import Question from 'types/interface/question.interface';

export default function InquireUpdate() {
  const { questionId, answer: answerIdParam } = useParams();
  const navigate = useNavigate();
  const { loginUser } = useLoginUserStore();
  const [cookies] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState("");
  const [imageFileList, setImageFileList] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [imageError, setImageError] = useState("");
  const [postRequest, setPostRequest] = useState<PostQuestionRequestDto>({
    title: "",
    content: "",
    nickname: "",
    type: "",
    imageList: [],
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // 컴포넌트가 마운트될 때 사용자 정보 설정
  useEffect(() => {
    const nickname = loginUser?.nickname;
    if (nickname) {
      setNickname(nickname);
      setIsLoggedIn(true);
    }
  }, [loginUser]);

  // 이전에 작성한 데이터가 있으면 설정
  // useEffect(() => {
  //   const fetchQuestion = async () => {
  //     try {
  //       const response = await getQuestionRequest(questionId);
  //       const { title, content, nickname, type, image } = response as unknown as Question;
  //       if (!title || !content || !nickname || !type) {
  //         throw new Error("Invalid response structure");
  //       }
  //       setQuestion(response as unknown as Question);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
  //       alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
  //       setLoading(false);
  //     }
  //   };
  //   fetchQuestion();
  // }, [questionId]);
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionRequest(questionId);
        const { title, content, nickname, type, imageList } = response as unknown as Question;
        if (!title || !content || !nickname || !type ) {
          throw new Error("Invalid response structure");
        }
        setQuestion(response as unknown as Question | null);
        setPostRequest({ title, content, nickname, type, imageList });
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        alert("질문 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchQuestion();
  }, [questionId]);


  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (event.target.value) setTitleError("");
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value) setContentError("");
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setType(selectedType);
    if (selectedType !== "1") setTypeError("");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    const files = Array.from(event.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };


  const handleImageRemove = (index: number) => {
    const newImageFileList = [...imageFileList];
    newImageFileList.splice(index, 1);
    setImageFileList(newImageFileList);

    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);
    setImagePreviews(newImagePreviews);
  };

  const uploadPostClickHandler = async () => {
    if (!isLoggedIn) {
      setErrorMessage("로그인을 한 후 이용해주세요.");
      return;
    }

    let hasError = false;

    if (!title) {
      setTitleError("제목을 입력해주세요.");
      hasError = true;
    }
    if (!content) {
      setContentError("내용을 입력해주세요.");
      hasError = true;
    }
    if (!type || type === "1") {
      setTypeError("문의 유형을 입력해주세요.");
      hasError = true;
    }
    if (hasError) return;

    // 데이터 저장
    const inquireData = {
      title,
      content,
      type,
      imagePreviews,
    };
    localStorage.setItem('inquireData', JSON.stringify(inquireData));

    try {
      const questionData: QuestionData = {
        title,
        content,
        nickname,
        type,
        imageList: imageFileList,
      };
      const result = await postQuestionRequest(questionData, cookies.accessToken);

      if (result && result.code === "SU") {
        alert("해당 문의가 업로드되었습니다.");
        localStorage.removeItem('inquireData'); // 성공 후 데이터 삭제
        navigate("/inquire");
      } else {
        setErrorMessage("해당 문의 업로드 실패");
      }
    } catch (error) {
      console.error("해당 문의 업로드 중 오류가 발생했습니다:", error);
      setErrorMessage("해당 문의 업로드 중 오류가 발생했습니다");
    }
  };

  const cancelClickHandler = () => {
    localStorage.removeItem('inquireData'); // 취소 시 데이터 삭제
    navigate("/inquire");
  };

  return (
    <table className="inquire-write">
      <thead>
        <tr>
          <th className="inquire-write-title">1대1 문의 접수</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className="inquire-write-left">문의 ID</th>
          <td className="inquire-write-right">{nickname}</td>
        </tr>
        <tr>
          <th className="inquire-write-left">문의유형</th>
          <td className="inquire-write-right">
            <select value={type} onChange={handleTypeChange}>
              <option value="1">문의 유형을 선택해주세요.</option>
              <option value="2">비매너 회원 신고</option>
              <option value="3">회원정보 안내</option>
              <option value="4">홈페이지 오류</option>
              <option value="5">기타 문의</option>
            </select>
            {typeError && <div style={{ color: 'red' }}>{typeError}</div>}
          </td>
        </tr>
        <tr>
          <th className="inquire-write-left">제목</th>
          <td className="inquire-write-right">
            <input
              type="text"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={handleTitleChange}
            />
            {titleError && <div style={{ color: 'red' }}>{titleError}</div>}
          </td>
        </tr>
        <tr>
          <th className="inquire-write-left">내용</th>
          <td className="inquire-write-right">
            <textarea
              placeholder="내용을 입력해주세요."
              value={content}
              onChange={handleContentChange}
            />
            {contentError && <div style={{ color: 'red' }}>{contentError}</div>}
          </td>
        </tr>
        <tr>
          <th className="inquire-write-left">사진</th>
          <td className="inquire-write-right">
            <input type="file" multiple onChange={handleImageChange} />
            <div style={{ display: 'flex', marginTop: '10px' }}>
              {imagePreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                  <img
                    src={preview}
                    alt={`이미지 미리보기 ${index}`}
                    style={{ width: '100px', height: 'auto', marginRight: '10px' }}
                  />
                  <button
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleImageRemove(index)}
                  >
                    <i className="fas fa-times-circle" style={{ fontSize: '1.5rem', color: 'gray' }} />
                  </button>
                </div>
              ))}
            </div>
            {imageError && <div style={{ color: 'red' }}>{imageError}</div>}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2}>
            <button onClick={cancelClickHandler}>취소</button>
            <button onClick={uploadPostClickHandler}>접수</button>
          </td>
        </tr>
      </tfoot>
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
    </table>
  );
}
