import { FileUploadRequest, PostNoticeRequest} from 'apis/apis';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Images } from 'types/interface/interface';

export default function InquireWrite() {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const { loginUser } = useLoginUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/authentication/signin');
      return;
    }
    const nickname = loginUser.nickname;
    if (!nickname) return;
    setNickname(nickname);
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

    const imageList: Images[] = [];
    for (const file of imageFileList) {
        const formData = new FormData();
        formData.append('file', file);
        const imageUrl = await FileUploadRequest(formData);
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
    if (hasError) return;

    try {
      const requestBody = { title, content, nickname, imageList };
      const result = await PostNoticeRequest(requestBody, cookies.accessToken);
      if (result && result.code === "SU") {
        alert("해당 공지가 업로드되었습니다.");
        navigate("/notice");
      } else {
        setErrorMessage("해당 공지 업로드 실패");
      }
    } catch (error) {
      console.error("해당 공지 업로드 중 오류가 발생했습니다:", error);
      setErrorMessage("해당 공지 업로드 중 오류가 발생했습니다");
    }
  };

  const cancelClickHandler = () => {
    navigate("/notice");
  };

  return (
    <table className="inquire-write">
      <thead>
        <tr>
          <th className="inquire-write-title">공지사항</th>
        </tr>
      </thead>
      <tbody>
        <div className="inquire-write-tr">
          <th className="inquire-write-left">관리자 닉네임</th>
          <td className="inquire-write-right">{nickname}</td>
        </div>
        <div className="inquire-write-tr">
          <th className="inquire-write-left">제목</th>
          <td className="inquire-write-right">
            <input
              type="text"
              placeholder=" 제목을 입력해 주세요."
              value={title}
              onChange={handleTitleChange}
            />
            {titleError && <div style={{ color: 'red' }}>{titleError}</div>}
          </td>
        </div>
        <div className="inquire-write-tr">
          <th className="inquire-write-left">내용</th>
          <td className="inquire-write-right">
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
                    <i className="fas fa-times-circle" style={{ fontSize: '1.5rem', color: 'gray' }} />
                  </button>
                </div>
              ))}
            </div>
          </td>
        </div>
      </tbody>
      <div className="inquire-write-button">
        <button className="inquire-write-cancel" onClick={cancelClickHandler}>취소</button>
        <button className="inquire-write-upload" onClick={uploadPostClickHandler}>업로드</button>
      </div>
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
    </table>
  );
}
