import { Get5RecentMeetingRequest, GetTop5FestivalListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Festival from 'types/interface/festival.interface';
import Meeting from 'types/interface/meeting.interface';
import FestivalDetail from 'views/festival/detail/festival-detail'

const Main: React.FC = () => {
  const navigator = useNavigate();
  const [top5FestivalList, setTop5FestivalList] = useState<Festival[]>([]);
  const [Recent5MeetingList, setRecent5MeetingList] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop5FestivalList = async () => {
      const response = await GetTop5FestivalListRequest();
      console.log(response)
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

  const NoticePathClickHandler = () => {
    navigator('/notice');
  }
  const FestivalPathClickHandler = () => {
    navigator('/festival/search');
  }
  const meetingPathClickHandler = () => {
    navigator('/meeting/list');
  }

  const handleTitleClick = (contentId: string | number) => {
    navigator(`/festival/detail?contentId=${contentId}`);
  };

  const handleMeetingTitleClick = (meetingId: string | number) => {
    navigator(`/meeting/detail/${meetingId}`);
  }




  return (
    <div>
      <div>
        <div onClick={NoticePathClickHandler}>공지사항</div>
        <div onClick={FestivalPathClickHandler}>축제</div>
        <div onClick={meetingPathClickHandler}>모임</div>
      </div>
      <div>
        <div>배너</div>
      </div>
      <div>
        <div>
          <div>온도왕</div>
          <div>1~3위 프로필, 닉네임</div>
        </div>
        <div>
          <br />
          <div>축제</div>
          <div>최신5개</div>
          <br />

          <div>
            {top5FestivalList.map((festival, index) => (
              <div onClick={() => handleTitleClick(festival.contentId)}>{festival.title}</div>
            ))}
          </div>

        </div>
        <div>
          <br />
          <div>모임</div>
          <div>최신5개</div>
          <br />

          <div>
            {Recent5MeetingList.map((meeting, index) => (
              <div onClick={() => handleMeetingTitleClick(meeting.meetingId)}>{meeting.title}</div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
};
export default Main;
