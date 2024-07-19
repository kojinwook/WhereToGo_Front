import { FileUploadRequest, GetNoticeRequest, PatchNoticeRequest } from "apis/apis";
import { ChangeEvent, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import useLoginUserStore from "store/login-user.store";
import Images from "types/interface/image.interface";

interface RouteParams {
  noticeId: string;
  [key: string]: string | undefined;
};

const NoticeUpdate: React.FC = () => {
  const { noticeId } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const { loginUser } = useLoginUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [noticeLoaded, setNoticeLoaded] = useState(false);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await GetNoticeRequest(noticeId);
        if(!response) return;
        const { title, content, nickname, imageList } = response.notice;
        setTitle(title);
        setContent(content);
        setNickname(nickname);
        const imageUrls = imageList.map((image: Images) => image.image);
        setImagePreviews(imageUrls);
        setNoticeLoaded(true);
      } catch (error) {
        console.error("공지사항 정보를 불러오는 중 오류가 발생했습니다:", error);
        setNoticeLoaded(true);
      }
    };

    fetchNotice();
  }, [noticeId]);

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
    if (!noticeId) return;

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
      const result = await PatchNoticeRequest(noticeId, requestBody, cookies.accessToken);
      console.log(result);
      if (result && result.code === "SU") {
        alert("공지사항이 성공적으로 수정되었습니다.");
        navigate(`/notice/detail/${noticeId}`);
      } else {
        setErrorMessage("공지사항 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("공지사항 수정 중 오류가 발생했습니다:", error);
      setErrorMessage("공지사항 수정 중 오류가 발생했습니다.");
    }
  };

  const cancelClickHandler = () => {
    navigate(`/notice/detail/${noticeId}`);
  };

  if (!noticeLoaded) {
    return <div>로딩 중...</div>;
  }

  return (
    <table className="inquire-update">
      <thead>
        <tr>
          <th className="inquire-update-title">공지 수정</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <div className='inquire-update-tr'>
            <th className="inquire-update-left">질문 ID</th>
            <td className="inquire-update-right">{nickname}</td>
          </div>
        </tr>
        <tr>
        <div className='inquire-update-tr'>
          <th className="inquire-update-left">제목</th>
          <td className="inquire-update-right">
            <input
              type="text"
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={handleTitleChange}
            />
            {titleError && <div style={{ color: 'red' }}>{titleError}</div>}
          </td>
          </div>
        </tr>
        <tr>
        <div className='inquire-update-tr'>
          <th className="inquire-update-left">내용</th>
          <td className="inquire-update-right">
            <textarea
              placeholder="내용을 입력해주세요."
              value={content}
              onChange={handleContentChange}
            />
            {contentError && <div style={{ color: 'red' }}>{contentError}</div>}
          </td>
          </div>
        </tr>
        <tr>
        <div className='inquire-update-tr'>
          <th className="inquire-update-left">사진</th>
          <td className="inquire-update-right">
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
          </div>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2} className="inquire-update-button">
            <button className="inquire-update-cancel" onClick={cancelClickHandler}>취소</button>
            <button className="inquire-update-upload" onClick={uploadPostClickHandler}>수정</button>
          </td>
        </tr>
      </tfoot>
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
    </table>
  );
};

export default NoticeUpdate;
