import { GetJoinMeetingMemberRequest, GetMeetingListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Images, Meeting } from 'types/interface/interface';
import './style.css';
import { useCookies } from 'react-cookie';

export interface Category {
  name: string;
}

export interface Location {
  name: string;
}

export default function MeetingList() {

  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 선택된 카테고리 상태
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]); // 선택된 지역 상태
  const [searchTerms, setSearchTerms] = useState<string[]>([]); // 검색어 배열
  const [joinMembersMap, setJoinMembersMap] = useState<{ [key: number]: number }>({});
  const [cookies] = useCookies();
  const navigate = useNavigate()

  const backGoPathClickHandler = () => {
    navigate(`/`);
  }

  const categories: Category[] = [
    { name: '전체' },
    { name: '여행' },
    { name: '음식' },
    { name: '문화/공연/축제' },
    { name: '업종/직무' },
    { name: '음악' },
    { name: '댄스/무용' },
    { name: '사교' },
    { name: '독서' },
    { name: '운동' },
    { name: 'e스포츠' },
    { name: '외국어' },
    { name: '스터디' },
    { name: '공예' },
    { name: '봉사' },
    { name: '차/오토바이' }
  ];

  const locations: Location[] = [
    { name: '전체' },
    { name: '서울' },
    { name: '인천' },
    { name: '대전' },
    { name: '대구' },
    { name: '광주' },
    { name: '부산' },
    { name: '울산' },
    { name: '세종' },
    { name: '경기' },
    { name: '강원' },
    { name: '충북' },
    { name: '충남' },
    { name: '경북' },
    { name: '경남' },
    { name: '전북' },
    { name: '전남' },
    { name: '제주' }
  ];

  useEffect(() => {
    const getMeetingList = async () => {
      try {
        const response = await GetMeetingListRequest();
        if (response && response.meetingList) {
          setMeetingList(response.meetingList);
        } else {
          setMeetingList([]);
        }
      } catch (error) {
        console.error('Error fetching meeting list:', error);
        setMeetingList([]); // 에러 발생 시 빈 배열로 초기화
      }
    };
    getMeetingList();
  }, []);

  useEffect(() => {
    const fetchJoinMembersForAllMeetings = async () => {
      const joinMembersCount: { [key: number]: number } = {};
      for (const meeting of meetingList) {
        try {
          const response = await GetJoinMeetingMemberRequest(meeting.meetingId, cookies.accessToken);
          if (response && response.meetingUsersList) {
            joinMembersCount[meeting.meetingId] = response.meetingUsersList.length;
          }
        } catch (error) {
          console.error(`Failed to fetch join members for meeting ${meeting.meetingId}:`, error);
        }
      }
      setJoinMembersMap(joinMembersCount);
    };

    if (meetingList.length > 0) {
      fetchJoinMembersForAllMeetings();
    }
  }, [meetingList, cookies.accessToken]);

  const meetingTitleClickHandler = (meetingId: number) => {
    navigate(`/meeting/detail/${meetingId}`)
  }

  // "전체"를 클릭하면 선택 해제
  const categoryClickHandler = (categoryName: string) => {
    if (categoryName === '전체') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(categoryName)) {
          return prevSelected.filter((name) => name !== categoryName);
        } else {
          return [...prevSelected, categoryName];
        }
      });
    }
  };

  const locationClickHandler = (locationName: string) => {
    if (locationName === '전체') {
      setSelectedLocations([]);
    } else {
      setSelectedLocations((prevSelected) => {
        if (prevSelected.includes(locationName)) {
          return prevSelected.filter((name) => name !== locationName);
        } else {
          return [...prevSelected, locationName];
        }
      });
    }
  };

  // 카테고리 선택 여부 확인
  const isSelectedCategory = (categoryName: string) => {
    if (categoryName === '전체') {
      return selectedCategories.length === 0;
    }
    return selectedCategories.includes(categoryName);
  };

  const handleCategoryClass = (categoryName: string) => {
    return `category-option ${isSelectedCategory(categoryName) ? 'selected' : ''}`;
  };

  const isSelectedLocation = (locationName: string) => {
    if (locationName === '전체') {
      return selectedLocations.length === 0;
    }
    return selectedLocations.includes(locationName);
  };

  const handleLocationClass = (locationName: string) => {
    return `category-option ${isSelectedLocation(locationName) ? 'selected' : ''}`;
  };

  const filteredMeetingList = meetingList.filter((meeting) => {
    const meetingLocations = meeting.locations;
    const meetingCategories = meeting.categories;
    const meetingTags = meeting.tags;

    const locationMatch = selectedLocations.length === 0 || selectedLocations.some(location => meetingLocations.includes(location));
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(category => meetingCategories.includes(category));
    const searchTermMatch = searchTerms.length === 0 || searchTerms.some(term => meetingTags.includes(term));

    return locationMatch && categoryMatch && searchTermMatch;
  });

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newSearchTerm = e.currentTarget.value.trim();
      if (newSearchTerm && !searchTerms.includes(newSearchTerm)) {
        setSearchTerms([...searchTerms, newSearchTerm]);
        e.currentTarget.value = '';
      }
    }
  };

  const removeSearchTerm = (term: string) => {
    setSearchTerms(searchTerms.filter(t => t !== term));
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

    if (images.length === 0) {
      return <div></div>;
    }

    return (
      <div className="image-slider">
        <img src={images[currentIndex].image || ''} alt={`Meeting Image ${currentIndex + 1}`} className="meeting-image" />
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
                key={category.name}
                className={handleCategoryClass(category.name)}
                onClick={() => categoryClickHandler(category.name)}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>
        <div className='meeting-list-category'>
          <h4>지역</h4>
          <div className='location-select'>
            {locations.map((location) => (
              <div
                key={location.name}
                className={handleLocationClass(location.name)}
                onClick={() => locationClickHandler(location.name)}
              >
                {location.name}
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
              onKeyDown={handleSearchKeyDown}
            />
            <div>
              {searchTerms.map((term, index) => (
                <div key={index}>
                  #{term}
                  <span onClick={() => removeSearchTerm(term)}>&times;</span>
                </div>
              ))}
            </div>
            {/* <button
              className='category-search-button'
              onClick={() => console.log('Search button clicked')}
            >
              검색
            </button> */}
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
        {filteredMeetingList.length > 0 ? (
          filteredMeetingList.map((meeting) => (
            <li key={meeting.meetingId} className='meeting-item' onClick={() => meetingTitleClickHandler(meeting.meetingId)}>
              {<ImageSlider images={meeting.imageList} />}
              <div className='meeting-title'>{meeting.title}</div>
              <div>{meeting.userNickname}</div>
              <div>{meeting.introduction}</div>
              <div>{joinMembersMap[meeting.meetingId]}/{meeting.maxParticipants}</div>
            </li>
          ))
        ) : (
          <li className='no-meetings-message'>선택된 조건에 해당하는 모임이 없습니다.</li>
        )}
      </ul>
    </div>
  )
}
