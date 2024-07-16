import { GetAllNoticeRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 초기 정렬 순서

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const filteredNotices = posts.filter(notice =>
      notice.title.includes(searchTerm)
    );
    return filteredNotices;
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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    // 정렬 로직 구현
    setPosts([...posts].sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.createDateTime).getTime() - new Date(b.createDateTime).getTime();
      } else {
        return new Date(b.createDateTime).getTime() - new Date(a.createDateTime).getTime();
      }
    }));
  };

  const noticeClickHandler = (noticeId: number | string | undefined) => {
    navigator(`/notice/detail/${noticeId}`);
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
        <button onClick={() => {
          const filteredNotices = handleSearch();
          if (filteredNotices.length === 0) {
            alert('해당하는 게시물이 없습니다.');
          }
          // 필요시 상태 업데이트
        }}>검색</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {posts.length === 0 ? (
            <p>게시물이 없습니다.</p>
          ) : (
            <div className="notices">
              {posts.map((notice) => (
                <div className="notice" key={notice.id}>
                  <p>번호: {notice.id}</p>
                  <p onClick={() => noticeClickHandler(notice.id)}>제목: {notice.title}</p>
                  <p>작성일: {formatDate(notice.createDateTime)}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoticeList;
