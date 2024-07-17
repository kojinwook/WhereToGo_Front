import { GetMeetingListRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meeting } from 'types/interface/interface';
import './style.css';

export default function MeetingList() {

  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const navigate = useNavigate()

    useEffect(() => {
        const getMeetingList = async () => {
            const response = await GetMeetingListRequest()
            console.log(response)
            setMeetingList(response.meetingList)
        }
        getMeetingList()
    }, [])

    const meetingTitleClickHandler = (meetingId: number) => {
        navigate(`/meeting/detail/${meetingId}`)
    }

    if(!meetingList)
    return <div>모임이 없습니다.</div>
  return (
    <div className='meeting-list-container'>
      <h1>모임 리스트</h1>
      <div className='meeting-list-write-btn'>
        <button onClick={() => navigate('/meeting/write')}>모임 만들기</button>
      </div>
      <ul>
        {meetingList.map((meeting) => (
          <React.Fragment key={meeting.meetingId}>
            <li onClick={() => meetingTitleClickHandler(meeting.meetingId)}>{meeting.title}</li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  )
}
