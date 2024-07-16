import { FileUploadRequest, PostMeetingRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Images } from 'types/interface/interface';
// import './style.css';

export default function MeetingWrite() {
  const {loginUser} = useLoginUserStore();
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [maxParticipants, setMaxParticipants] = useState<number>(1);
  const [cookies] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginUser) return;
    setNickname(loginUser.nickname);
  }, []);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const handleIntroduction = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntroduction(event.target.value);
  }

  const handleContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  }

  const handleMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value > 20) {
      alert('최대 인원은 20명으로 제한됩니다.');
      setMaxParticipants(20);
    } else {
      setMaxParticipants(value);
    }
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

  const handlePost = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('introduction', introduction);
    formData.append('content', content);

    let imageUrl: Images | null = null;
    if (imageFileList.length > 0) {
      const formData = new FormData();
      formData.append('file', imageFileList[0]);
      imageUrl = await FileUploadRequest(formData);
    }

    try {
      const requestBody = { title, introduction, content, imageUrl, nickname, maxParticipants };
      const response = await PostMeetingRequest(requestBody, cookies.accessToken);
      if (response.code === 'SU') {
        alert('모임이 성공적으로 등록되었습니다.');
        navigate('/meeting/list');
      } else {
        alert('모임 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('모임 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className='meeting-write-container'>
      <p><strong>모임 명</strong></p>
      <input
        type="text"
        placeholder="모임 명을 입력해주세요."
        value={title}
        onChange={handleTitle}
      />

      <br />

      <p><strong>한 줄 소개</strong></p>
      <label className='introduction'>
        <textarea
          className='introduction-textarea'
          placeholder='한 줄 소개'
          value={introduction}
          onChange={handleIntroduction}
        ></textarea>
      </label>

      <br />

      <p><strong>내용</strong></p>
      <label className='content'>
        <textarea
          className='content-textarea'
          placeholder='내용'
          value={content}
          onChange={handleContent}
        ></textarea>
      </label>

      <br />

      <p><strong>최대 인원</strong></p>
      <input
        type="number"
        placeholder="최대 인원을 입력해주세요."
        value={maxParticipants}
        onChange={handleMaxParticipants}
        min={1}
        max={20}
      />

      <p><strong>사진</strong></p>
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

      <button onClick={handlePost}>등록</button>
    </div>
  )
}
