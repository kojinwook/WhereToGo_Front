import React, { useState, useSyncExternalStore } from 'react'
// import './style.css';

export default function MeetingWrite() {
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [content, setContent] = useState<string>('');

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

    imageFileList.forEach((file, index) => {
      formData.append(`imageFile${index}`, file);
    });

    try {
      const response = await fetch('/api/v1/meeting', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // 성공 처리
        alert('모임이 성공적으로 등록되었습니다.');
      } else {
        // 실패 처리
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
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <p><strong>한 줄 소개</strong></p>
      <label className='introduction'>
        <textarea 
          className='introduction-textarea' 
          placeholder='한 줄 소개'
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        ></textarea>
      </label>

      <br />

      <p><strong>내용</strong></p>
      <label className='content'>
      <textarea 
          className='content-textarea' 
          placeholder='내용'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </label>

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
