import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetAllNoticeRequest } from 'apis/apis';
import Notice from 'types/interface/notice.interface';
import './style.css';

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await GetAllNoticeRequest();
        console.log(result)
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
    setFilteredPosts(posts); // Initialize filteredPosts with all posts
  }, [posts]);

  useEffect(() => {
    const filteredNotices = handleSearch();
    setFilteredPosts(filteredNotices);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      return posts; // If no search term, return all posts
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
      // 필요시 상태 업데이트
    }
  };

  const noticeClickHandler = (noticeId: number | string | undefined) => {
    navigator(`/notice/detail/${noticeId}`);
  };

  const handleSearchButtonClick = () => {
    const filteredNotices = handleSearch();
    if (filteredNotices.length === 0) {
      alert('해당하는 게시물이 없습니다.');
    }
    setFilteredPosts(filteredNotices);
    setSearchTerm(''); // Reset search term after search
  };

  return (
    <div className="notice-list">
      <h1>공지사항</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearchButtonClick}>검색</button>
      </div>
      <div className="notices">
        <table className="notice-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={3}>게시물이 없습니다.</td>
              </tr>
            ) : (
              filteredPosts.map((notice) => (
                <tr key={notice.noticeId} onClick={() => noticeClickHandler(notice.noticeId)}>
                  <td>{notice.noticeId}</td>
                  <td>{notice.title}</td>
                  <td>{formatDate(notice.createDateTime)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoticeList;
