import { postQuestionRequest } from 'apis/apis';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLoginUserStore from 'store/login-user.store';

export default function InquireWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const { loginUser } = useLoginUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [imageError, setImageError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const userId = loginUser?.userId;
    if (!userId) return;
    setUserId(userId);
    setIsLoggedIn(true);
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

    switch (

    selectedType // 선택된 값에 따라 문자열로 변환
    ) {
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
    if (selectedType != "1") setTypeError("");
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
      const requestBody = { title, content, userId, type, image };
      const result = await postQuestionRequest(requestBody);

      if (result && result.code === "SU") {
        alert("해당 문의가 업로드되었습니다.");
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
    navigate("/inquire");
  };

  return (
    <table className="inquire-write">
      <thead>
        <tr>
          <th className="inquire-write-title">1대1 문의 접수
            <tfoot>
            </tfoot>
          </th>
        </tr>
      </thead>
      <tbody>
        <div className="inquire-write-tr">
          <th className="inquire-write-left">문의 ID</th>
          <td className="inquire-write-right">{userId}</td>
        </div>
        <div className="inquire-write-tr">
          <th className="inquire-write-left">문의유형</th>
          <td className="inquire-write-right">
            <label htmlFor="inquire"></label>
            <select id="inquire" value={type} onChange={handleTypeChange} >
              <option value="1">문의 유형을 선택해주세요.</option>
              <option value="2">비매너 회원 신고</option>
              <option value="3">회원정보 안내</option>
              <option value="4">홈페이지 오류</option>
              <option value="5">기타 문의</option>
            </select>
            {typeError && <div style={{ color: 'red' }}>{typeError}</div>}
          </td>
        </div>
        <div className="inquire-write-tr">
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
        </div>
        <div className="inquire-write-tr-content">
          <th className="inquire-write-left-content">내용</th>
          <td className="inquire-write-right-content">
            <textarea
              placeholder="내용을 입력해주세요."
              value={content}
              onChange={handleContentChange}
            />
            {contentError && <div style={{ color: 'red' }}>{contentError}</div>}
          </td>
        </div>
        <div className="inquire-write-tr">
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
                    <i className="fas fa-times-cir cle" style={{ fontSize: '1.5rem', color: 'gray' }} />
                  </button>
                </div>
              ))}
            </div>
            {imageError && <div style={{ color: 'red' }}>{imageError}</div>}
          </td>
        </div>
      </tbody>
      <div className="inquire-write-button">
        <button className="inquire-write-cancel" onClick={cancelClickHandler}>취소</button>
        <button className="inquire-write-upload" onClick={uploadPostClickHandler}>접수</button>
      </div>
    </table>
  );
}
