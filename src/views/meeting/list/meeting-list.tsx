import { GetMeetingListRequest } from 'apis/apis'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Meeting } from 'types/interface/interface'
import './style.css';

export default function MeetingList() {

  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const navigate = useNavigate()

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

  if (!meetingList) return <div>
    <div className='meeting-list-write-btn'>
      <button onClick={() => navigate('/meeting/write')}>모임 만들기</button>
    </div>
  </div>
  console.log(meetingList)
  return (
    <div className='meeting-list-container'>
      <h1>모임 리스트</h1>
      <div className='meeting-list-write-btn'>
        <button onClick={() => navigate('/meeting/write')}>모임 만들기</button>
      </div>
      <ul>
        {meetingList.map((meeting) => (
          <div>
            <li key={meeting.meetingId} onClick={() => meetingTitleClickHandler(meeting.meetingId)}>{meeting.title}</li>
            <div className='meeting-images'>
              {meeting.imageList.map((image, index) => (
                <img key={index} src={image.image} alt={`Meeting Image ${index + 1}`} className='meeting-image' />
              ))}
            </div>
          </div>
        ))}
      </ul>
    </div>
  )
}
