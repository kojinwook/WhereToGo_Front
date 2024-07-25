import { Get5RecentMeetingRequest, GetTop5FestivalListRequest, Top5TemperatureUserRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Festival from 'types/interface/festival.interface';
import Meeting from 'types/interface/meeting.interface';
import User from 'types/interface/user.interface';
import defaultProfileImage from 'assets/images/user.png';
import './style.css';

const Main: React.FC = () => {
  const navigator = useNavigate();
  const [top5FestivalList, setTop5FestivalList] = useState<Festival[]>([]);
  const [Recent5MeetingList, setRecent5MeetingList] = useState<Meeting[]>([]);
  const [top5TemperatureUserList, setTop5TemperatureUserList] = useState<User[]>([])
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }
    fetchTop5FestivalList();
  }, []);

  useEffect(() => {
    const fetchRecent5MeetingList = async () => {
      const response = await Get5RecentMeetingRequest();
      if (!response) return;
      setRecent5MeetingList(response.meetingList);
      setLoading(false);
    }
    fetchRecent5MeetingList();
  }, []);

  useEffect(() => {
    const fetchTop5TemperatureUserList = async () => {
      const response = await Top5TemperatureUserRequest();
      if (!response) return;
      setTop5TemperatureUserList(response.userList);
      setLoading(false);
    }
    fetchTop5TemperatureUserList();
  }, [])

  const formatDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}년 ${month}월 ${day}일`;
  };
  const NoticePathClickHandler = () => {
    navigator('/notice');
  }
  const FestivalPathClickHandler = () => {
    navigator('/festival/search');
  }
  const meetingPathClickHandler = () => {
    navigator('/meeting/list');
  }
  const inquirePathClickHandler = () => {
    navigator('/inquire/list');
  }

  const handleTitleClick = (contentId: string | number) => {
    navigator(`/festival/detail?contentId=${contentId}`);
  };

  const handleMeetingTitleClick = (meetingId: string | number) => {
    navigator(`/meeting/detail/${meetingId}`);
  }

  // 배너
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

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
        <div className='main-header'>
          <div className="header-item" onClick={inquirePathClickHandler}>고객센터</div>
          <div className="header-item" onClick={NoticePathClickHandler}>공지사항</div>
          <div className="header-item" onClick={FestivalPathClickHandler}>축제</div>
          <div className="header-item" onClick={meetingPathClickHandler}>모임</div>
        </div>
        <div className='content'>
          <div className='temperature-users section'>
            <div className="section-title">온도왕</div>
            <div>1~3위 프로필, 닉네임</div>
            <br />

            {top5TemperatureUserList.map((user, index) => (
              <div key={index}>
                <img src={user.profileImage ? user.profileImage : defaultProfileImage} alt="profile" className='board-list-profile-image' />
                <div>{user.nickname}</div>
                <div>{user.temperature}</div>
              </div>
            ))}
          </div>

          <div className='recent-festivals section'>
            <div className="section-title">축제</div>
            <div>최신5개</div>
            <br />

            <div>
              {top5FestivalList.map((festival, index) => (
                <div key={index}>
                  <div onClick={() => handleTitleClick(festival.contentId)}>{festival.title}</div>
                  <div>{formatDate(festival.startDate)} ~ {formatDate(festival.endDate)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className='recent-meetings section'>
            <div className="section-title">모임</div>
            <div>최신5개</div>
            <br />

            <div>
              {Recent5MeetingList.map((meeting, index) => (
                <div key={index}>
                  <div onClick={() => handleMeetingTitleClick(meeting.meetingId)}>{meeting.title}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
};
export default Main;
