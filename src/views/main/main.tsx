import { GetTop5FestivalListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Festival from 'types/interface/festival.interface';
import FestivalDetail from 'views/festival/detail/festival-detail'

const Main : React.FC = () => {
  const navigator = useNavigate();
  const [top5FestivalList, setTop5FestivalList] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop5FestivalList = async () => {
      const response = await GetTop5FestivalListRequest();
      if (!response) return;
      setTop5FestivalList(response.festivalList);
      setLoading(false);
    }
    fetchTop5FestivalList();
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

  const handleTitleClick = (contentId: string) => {
    navigator(`/festival/detail?contentId=${contentId}`);
};





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
      </div>
    </div>
    </div>
  )
};
export default Main;
