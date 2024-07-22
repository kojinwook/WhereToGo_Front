import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FestivalDetail from 'views/festival/detail/festival-detail'

const Main : React.FC = () => {
  const navigator = useNavigate();
  const [loading, setLoading] = useState(true);

  const NoticePathClickHandler = () => {
    navigator('/notice');
  }
  const FestivalPathClickHandler = () => {
    navigator('/festival/search');
  }
  const meetingPathClickHandler = () => {
    navigator('/meeting/list');
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
        <div>축제</div>
        <div>최신5개</div>
      </div>
      <div>
        <div>모임</div>
        <div>최신5개</div>
      </div>
    </div>
    </div>
  )
};
export default Main;
