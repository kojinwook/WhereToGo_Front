import { GetAllNoticeRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Notice from 'types/interface/notice.interface';
import './style.css';
import Pagination from 'components/Pagination'; // Pagination 컴포넌트 import
import useLoginUserStore from 'store/login-user.store';

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const NoticeList: React.FC = () => {
  const navigator = useNavigate();
  const { noticeId } = useParams();
  const [posts, setPosts] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Notice[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // 페이지당 항목 수

  const { loginUser } = useLoginUserStore();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigator('/authentication/signin');
      return;
    }
    setRole(loginUser?.role);
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

  const backGoPathClickHandler = () => {
    navigator(`/inquire/`);
  }

  const handleSearchButtonClick = () => {
    const filteredNotices = handleSearch();
    if (filteredNotices.length === 0) {
      alert('해당하는 게시물이 없습니다.');
    }
    setFilteredPosts(filteredNotices);
    setSearchTerm('');
  };

  // 페이지네이션 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPosts = filteredPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

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
              <div className='notice-content-non'>공지사항이 없습니다.</div>
            </div>
          ) : (
            displayedPosts.map((notice, index) => (
              <div className='notice-content-item' key={index} onClick={() => noticeClickHandler(notice.noticeId)}>
                <div>{filteredPosts.length - startIndex - index}</div>
                <div>{notice.title}</div>
                <div>{formatDate(notice.createDateTime)}</div>
              </div>
            ))
          )}
        </ul>
      </div>
      <div className="pagination-box">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          viewPageList={Array.from({ length: totalPages }, (_, i) => i + 1)}
        />
      </div>
    </div>
  );
};

export default NoticeList;
