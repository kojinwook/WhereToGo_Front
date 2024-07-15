import React, { ChangeEvent, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { fileUploadRequest, getQuestionRequest, patchQuestionRequest } from 'apis/apis';
import { Images } from 'types/interface/interface';
import Question from 'types/interface/question.interface';

interface RouteParams {
  questionId: string;
  [key: string]: string | undefined;
}


const InquireUpdate: React.FC = () => {
  const { questionId } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState("");
  const { loginUser } = useLoginUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [imageError, setImageError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [questionLoaded, setQuestionLoaded] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await getQuestionRequest(questionId);
        const { title, content, nickname, type, imageList } = response.question;
        setTitle(title);
        setContent(content);
        setNickname(nickname);
        setType(type);
        const imageUrls = imageList.map((image: Images) => image.image); // 예시에서는 images 배열에서 이미지 URL을 가져온다고 가정
        setImagePreviews(imageUrls);
        setQuestionLoaded(true);
      } catch (error) {
        console.error("질문 정보를 불러오는 중 오류가 발생했습니다:", error);
        setQuestionLoaded(true);
      }
    };

    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    const nickname = loginUser?.nickname;
    if (nickname) {
      setNickname(nickname);
      setIsLoggedIn(true);
    }
  }, [loginUser]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (event.target.value) setTitleError("");
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value) setContentError("");
  };

  const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value; // 숫자 형태의 값이 들어옴
    let typeString = ""; // 변환된 문자열을 저장할 변수

    switch (selectedType) { // 선택된 값에 따라 문자열로 변환
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
    setType(selectedType); // 변환된 문자열을 state에 저장
    if (selectedType !== "1") setTypeError("");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    setImageFileList(files);

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
    if (!questionId) return;

    const imageList: Images[] = [];
    for (const file of imageFileList) {
      const formData = new FormData();
      formData.append('file', file);
      const imageUrl = await fileUploadRequest(formData);
      if (imageUrl) {
        imageList.push(imageUrl);
      }
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

    try {
      const requestBody = { title, content, nickname, type, imageList };
      const result = await patchQuestionRequest(questionId, requestBody, cookies.accessToken);
      console.log(result);
      if (result && result.code === "SU") {
        alert("질문이 성공적으로 수정되었습니다.");
        navigate(`/inquire/detail/${questionId}`);
      } else {
        setErrorMessage("질문 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("질문 수정 중 오류가 발생했습니다:", error);
      setErrorMessage("질문 수정 중 오류가 발생했습니다.");
    }
  };

  const cancelClickHandler = () => {
    navigate(`/inquire/detail/${questionId}`);
  };

  if (!questionLoaded) {
    return <div>로딩 중...</div>;
  }

  return (
    <table className="inquire-write">
      <thead>
        <tr>
          <th className="inquire-write-title">질문 수정</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className="inquire-write-left">질문 ID</th>
          <td className="inquire-write-right">{nickname}</td>
        </tr>
        <tr>
          <th className="inquire-write-left">질문 유형</th>
          <td className="inquire-write-right">
            <select value={type} onChange={handleTypeChange}>
              <option value="1">질문 유형을 선택해주세요.</option>
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
          <td colSpan={2} className="inquire-write-button">
            <button className="inquire-write-cancel" onClick={cancelClickHandler}>취소</button>
            <button className="inquire-write-upload" onClick={uploadPostClickHandler}>수정</button>
          </td>
        </tr>
      </tfoot>
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
    </table>
  );
};

export default InquireUpdate;
