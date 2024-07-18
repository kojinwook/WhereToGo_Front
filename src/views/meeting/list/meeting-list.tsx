import { GetMeetingListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Images, Meeting } from 'types/interface/interface';
import './style.css';

export default function MeetingList() {

  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const navigate = useNavigate()

  const backGoPathClickHandler = () => {
    navigate(`/`);
}

  useEffect(() => {
    const getMeetingList = async () => {
      const response = await GetMeetingListRequest()
      if (!response) return
      setMeetingList(response.meetingList)
    }
    getMeetingList()
  }, [])

  const meetingTitleClickHandler = (meetingId: number) => {
    navigate(`/meeting/detail/${meetingId}`)
  }

  if (!meetingList)
  <div>
    <div className='meeting-list-write-btn'>
      <button onClick={() => navigate('/meeting/write')}>모임 만들기</button>
    </div>
  </div>

  const ImageSlider: React.FC<{ images: Images[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // 3초마다 이미지 전환

      return () => clearInterval(intervalId);
    }, [images.length]);

    return (
      <div className="image-slider">
        <img src={images[currentIndex].image} alt={`Meeting Image ${currentIndex + 1}`} className="meeting-image" />
      </div>
    );
  };
  
  return (
    <div className='meeting-list-container'>
      <h1>모임 리스트</h1>
      <div className='meeting-list-write-btn'>
        <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backGoPathClickHandler} />
        <button className='meeting-list-create-btn' onClick={() => navigate('/meeting/write')}>모임 만들기</button>
      </div>
      <div className='meeting-list-header'>
          <div>모임 사진</div>
          <div>모임 명</div>
          <div>대표</div>
          <div>한 줄 소개</div>
          <div>인원</div>
      </div>
      <ul>
        {meetingList.map((meeting) => (
            <li key={meeting.meetingId} className='meeting-item' onClick={() => meetingTitleClickHandler(meeting.meetingId)}>
              <ImageSlider images={meeting.imageList} />
              <div className='meeting-title'>{meeting.title}</div>
              <div>{meeting.userNickname}</div>
              <div>{meeting.introduction}</div>
              <div>{meeting.maxParticipants}</div>
            </li>
        ))}
      </ul>
    </div>
  )
}
