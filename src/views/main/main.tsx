import { Get5RecentMeetingRequest, GetTop5FestivalListRequest, Top5TemperatureUserRequest } from 'apis/apis';
import defaultProfileImage from 'assets/images/user.png';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Festival from 'types/interface/festival.interface';
import Meeting from 'types/interface/meeting.interface';
import User from 'types/interface/user.interface';
import './style.css';

const Main: React.FC = () => {
  const navigator = useNavigate();
  const [top5FestivalList, setTop5FestivalList] = useState<Festival[]>([]);
  const [Recent5MeetingList, setRecent5MeetingList] = useState<Meeting[]>([]);
  const [top3TemperatureUserList, setTop3TemperatureUserList] = useState<User[]>([]);

  const images = [
    "https://i.imgur.com/PKqEZdk.png",
    "https://i.imgur.com/qiBAt1e.png"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTop5FestivalList = async () => {
      const response = await GetTop5FestivalListRequest();
      if (!response) return;
      setTop5FestivalList(response.festivalList);
    };
    fetchTop5FestivalList();
  }, []);

  useEffect(() => {
    const fetchRecent5MeetingList = async () => {
      const response = await Get5RecentMeetingRequest();
      if (!response) return;
      setRecent5MeetingList(response.meetingList);
    };
    fetchRecent5MeetingList();
  }, []);

  useEffect(() => {
    const fetchTop3TemperatureUserList = async () => {
      const response = await Top5TemperatureUserRequest();
      if (!response) return;
      setTop3TemperatureUserList(response.userList);
    };
    fetchTop3TemperatureUserList();
  }, []);

  const formatDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleTitleClick = (contentId: string | number) => {
    navigator(`/festival/detail?contentId=${contentId}`);
  };

  const handleMeetingTitleClick = (meetingId: string | number) => {
    navigator(`/meeting/detail/${meetingId}`);
  };

  // 배너
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  // 배너 끝

  return (
    <div className='main-container'>
      <div className='banner'>
        <button className='arrow prev' onClick={prevSlide}>&#10094;</button>
        <img src={images[currentIndex]} alt="슬라이드 이미지" className='slide-image' />
        <button className='arrow next' onClick={nextSlide}>&#10095;</button>
      </div>
      <div className='main-content'>
        <div className='content'>
          <div className='temperature-users section'>
            <div className='title-container'>
              <img src="https://i.imgur.com/DeFG48l.png" alt="왕관" className='king' />
              <div className="section-title">온도왕</div>
            </div>
            
            <div className='temper-king-list'>
              {top3TemperatureUserList.length > 0 ? (
                top3TemperatureUserList.map((user, index) => (
                  <div key={index} className='user-item'>
                    <div className='user-rank'>{index + 1}</div>
                    <img src={user.profileImage ? user.profileImage : defaultProfileImage} alt="profile" className='board-list-profile-image' />
                    <div className='user-info'>
                      <div className='user-nickname'>{user.nickname}</div>
                    </div>
                    <div className='user-temperature'>{user.temperature}°</div>
                  </div>
                ))
              ) : (
                <div className='no-data'>유저가 없습니다</div>
              )}
            </div>
          </div>

          <div className='recent-festivals section'>
            <div className='title-container'>
              <img src="https://i.imgur.com/MZl5P8Z.png" alt="축제" className='new-festival-icon' />
              <div className="section-title">최신 등록 축제</div>
            </div>
            <div className='new-festival-list'>
              {top5FestivalList.length > 0 ? (
                top5FestivalList.map((festival, index) => (
                  <div key={index} className='new-festival-item'>
                    <div className='new-festival-details' onClick={() => handleTitleClick(festival.contentId)}>
                      <div className='new-festival-title'>{festival.title}</div>
                      <div className='festival-date'>{formatDate(festival.startDate)} ~ {formatDate(festival.endDate)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='no-data'>축제가 없습니다</div>
              )}
            </div>
          </div>

          <div className='recent-meetings section'>
            <div className='title-container'>
              <img src="https://i.imgur.com/9u9BJga.png" alt="축제" className='new-meeting-icon' />
              <div className="section-title">최신 등록 모임</div>
            </div>
            <div className='new-meeting-list'>
              {Recent5MeetingList.length > 0 ? (
                Recent5MeetingList.map((meeting, index) => (
                  <div key={index} className='new-meeting-item' onClick={() => handleMeetingTitleClick(meeting.meetingId)}>
                    <div className='meeting-rank'>{index + 1}</div>
                    <div className='new-meeting-title'>{meeting.title}</div>
                  </div>
                ))
              ) : (
                <div className='no-data'>모임이 없습니다</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
