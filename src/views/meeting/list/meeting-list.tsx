import { GetMeetingListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Images, Meeting } from 'types/interface/interface';
import './style.css';

export default function MeetingList() {

  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // 선택된 카테고리 상태
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]); // 선택된 지역 상태
  const navigate = useNavigate()


  const backGoPathClickHandler = () => {
    navigate(`/`);
  }

  const categories = [
    { id: 1, name: '전체' },
    { id: '2', name: '여행' },
    { id: '3', name: '음식' },
    { id: '4', name: '문화/공연/축제' },
    { id: '5', name: '업종/직무' },
    { id: '6', name: '음악' },
    { id: '7', name: '댄스/무용' },
    { id: '8', name: '사교' },
    { id: '9', name: '독서' },
    { id: '10', name: '운동' },
    { id: '11', name: 'e스포츠' },
    { id: '12', name: '외국어' },
    { id: '13', name: '스터디' },
    { id: '14', name: '공예' },
    { id: '15', name: '봉사' },
    { id: '16', name: '차/오토바이' }
  ];

  const locations = [
    { name: '전체', code: '0' },
    { name: '서울', code: '1' },
    { name: '인천', code: '2' },
    { name: '대전', code: '3' },
    { name: '대구', code: '4' },
    { name: '광주', code: '5' },
    { name: '부산', code: '6' },
    { name: '울산', code: '7' },
    { name: '세종', code: '8' },
    { name: '경기', code: '31' },
    { name: '강원', code: '32' },
    { name: '충북', code: '33' },
    { name: '충남', code: '34' },
    { name: '경북', code: '35' },
    { name: '경남', code: '36' },
    { name: '전북', code: '37' },
    { name: '전남', code: '38' },
    { name: '제주', code: '39' }
  ];

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

  // "전체"를 클릭하면 선택 해제
  const categoryClickHandler = (categoryId: number) => {
    if (categoryId === 1) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(categoryId)) {
          return prevSelected.filter((id) => id !== categoryId);
        } else {
          return [...prevSelected, categoryId];
        }
      });
    }
  };

  const locationClickHandler = (locationsCode: number) => {
    if (locationsCode === 0) {
      setSelectedLocations([]);
    } else {
      setSelectedLocations((prevSelected) => {
        if (prevSelected.includes(locationsCode)) {
          return prevSelected.filter((code) => code !== locationsCode);
        } else {
          return [...prevSelected, locationsCode];
        }
      });
    }
  };
  
  // 카테고리 선택 여부 확인
  const isSelectedCategory = (categoryId: number) => {
    if (categoryId === 1) {
      return selectedCategories.length === 0;
    }
    return selectedCategories.includes(categoryId);
  };

  const handleCategoryClass = (categoryId: number) => {
    return `category-option ${isSelectedCategory(categoryId) ? 'selected' : ''}`;
  };
  
  const isSelectedLocation = (locationsCode: number) => {
    if (locationsCode === 0) {
      return selectedLocations.length === 0;
    }
    return selectedLocations.includes(locationsCode);
  };

  const handleLocationClass = (locationsCode: number) => {
    return `category-option ${isSelectedLocation(locationsCode) ? 'selected' : ''}`;
  };

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

      <div className='meeting-list-categories'>
        <div className='meeting-list-category'>
          <h4>카테고리</h4>
          <div className='category-select'>
            {categories.map((category) => (
              <div
                key={category.id}
                className={handleCategoryClass(Number(category.id))}
                onClick={() => categoryClickHandler(Number(category.id))}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
        <div className='meeting-list-category'>
          <h4>지역</h4>
          <div className='location-select'>
            {locations.map((locations) => (
              <div
                key={locations.code}
                className={handleLocationClass(Number(locations.code))}
                onClick={() => locationClickHandler(Number(locations.code))}
              >
                {locations.name}
              </div>
            ))}
          </div>
        </div>
        <div className='meeting-list-category'>
          <div className='category-search-container'>
            <input
              type='text'
              className='category-search-input'
              placeholder='검색'
              onClick={() => console.log('Search input clicked')}
            />
            <button
              className='category-search-button'
              onClick={() => console.log('Search button clicked')}
            >
              검색
            </button>
          </div>
        </div>
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
              {<ImageSlider images={meeting.imageList} />}
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
