import { GetAllNoticeRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Notice from 'types/interface/notice.interface';
import './style.css';
import useLoginUserStore from 'store/login-user.store';

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const NoticeList: React.FC = () => {
  const navigator = useNavigate();
  const { noticeId } = useParams();
  const [posts, setPosts] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Notice[]>([]);
  const {loginUser} = useLoginUserStore();
  const [userId, setUserId]= useState("");
  const [role, setRole] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);


  useEffect(() => {
    const userId = loginUser?.userId;
    const role = loginUser?.role;
    console.log("userId", userId, "role", role);
    if(!userId || !role) return;
    setUserId(userId);
    setRole(role);
    setIsLoggedIn(true);
  }, [loginUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await GetAllNoticeRequest();
        if (!result) return;
        const { code, notices } = result;
        if (code === 'DBE') {
          alert('데이터베이스 오류입니다.');
          return;
        }
        if (code !== 'SU') return;
        setPosts(notices);
        setLoading(false);
      } catch (error) {
        console.log('공지사항을 불러오는데 실패했습니다.', error);
      }
    };
    fetchPosts();
  }, [noticeId]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  useEffect(() => {
    const filteredNotices = handleSearch();
    setFilteredPosts(filteredNotices);
  }, [searchTerm]);

  const backGoPathClickHandler = () => {
    navigator(`/inquire/`);
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      return posts; 
    } else {
      return posts.filter(notice =>
        notice.title.includes(searchTerm)
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const filteredNotices = handleSearch();
      if (filteredNotices.length === 0) {
        alert('해당하는 게시물이 없습니다.');
      }
    }
  };

  const noticeClickHandler = (noticeId: number | string | undefined) => {
    navigator(`/notice/detail/${noticeId}`);
  };
  const writePathClickHandler = () => {
    navigator(`/notice/write`);
  }

  const handleSearchButtonClick = () => {
    const filteredNotices = handleSearch();
    if (filteredNotices.length === 0) {
      alert('해당하는 게시물이 없습니다.');
    }
    setFilteredPosts(filteredNotices);
    setSearchTerm(''); 
  };

  return (
    <div className="notice-list">
      <h1>공지사항</h1>
      <div className="notice-search-container">
        <img src="https://i.imgur.com/PfK1UEF.png" alt="뒤로가기" onClick={backGoPathClickHandler} />
        <div>
          <input
            className="notice-search-input"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
          <button className='notice-search-btn' onClick={handleSearchButtonClick}>검색</button>
        </div>
      </div>
      {role === "ROLE_ADMIN" && (
        <div className="notice-write-button-container">
        <button className="notice-write-button" onClick={writePathClickHandler}>작성</button>
      </div>
        )}
      <div className="notices">
        <div className='notice-header'>
            <div>NO.</div>
            <div>제목</div>
            <div>날짜</div>
        </div>
        <ul className='notice-content'>
          {filteredPosts.length === 0 ? (
            <div>
              <div className='notice-content-non'>게시물이 없습니다.</div>
            </div> 
          ) : (
            filteredPosts.map((notice, index) => (
              <div className='notice-content-item' key={notice.id} onClick={() => noticeClickHandler(notice.noticeId)}>
                <div>{posts.length - index}</div>
                <div>{notice.title}</div>
                <div>{formatDate(notice.createDateTime)}</div>
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NoticeList;
