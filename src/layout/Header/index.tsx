import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import logoImage from 'assets/images/logo.png';
import './style.css';
import { useCookies } from 'react-cookie';
import bellButton from 'assets/images/bell.png';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Notification from 'types/interface/notification.interface';
import { GetMeetingBoardsTitleRequest } from 'apis/apis';
import NotificationsModal from 'components/notification/notification';

export default function Header() {
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  const [isLogin, setLogin] = useState<boolean>(false);
  const [role, setRole] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meetingBoardTitles, setMeetingBoardTitles] = useState<Map<number, string>>(new Map());
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies();
  const client = React.useRef<Client | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginUser && cookies.accessToken) {
      const socket = new SockJS('http://15.165.24.165:8088/ws');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          stompClient.subscribe(`/topic/notifications/${loginUser.nickname}`, (message) => {
            const notification = JSON.parse(message.body);
            if (notification.senderId !== loginUser.userId && (!notification.replySender || notification.replySender !== loginUser.nickname)) {
              setNotifications((prev) => {
                const isAlreadyExist = prev.some((n) => n.id === notification.id);
                if (!isAlreadyExist) {
                  const updatedNotifications = [...prev, { ...notification, timestamp: new Date().getTime() }];
                  localStorage.setItem(`notifications_${loginUser.userId}`, JSON.stringify(updatedNotifications));
                  return updatedNotifications;
                }
                return prev;
              });
            }
          });
        },
        onDisconnect: () => {
          console.log('Disconnected');
        },
      });
      stompClient.activate();
      client.current = stompClient;
      const savedNotifications = localStorage.getItem(`notifications_${loginUser.userId}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      return () => {
        if (client.current) {
          client.current.deactivate();
        }
      };
    }
  }, [loginUser, cookies.accessToken]);

  useEffect(() => {
    const role = loginUser?.role;
    if (!role) return;
    setRole(role);
  }, [loginUser])

  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser])

  useEffect(() => {
    const fetchMeetingBoardTitles = async () => {
      const meetingBoardIds = notifications.map((notification) => notification.meetingBoardId);
      const response = await GetMeetingBoardsTitleRequest(meetingBoardIds);
      if (!response) return;

      const titlesMap = new Map<number, string>();
      response.meetingBoardTitle.forEach((title, index) => {
        titlesMap.set(meetingBoardIds[index], title);
      });

      setMeetingBoardTitles(titlesMap);
    };
    if (notifications.length > 0) {
      fetchMeetingBoardTitles();
    }
  }, [notifications]);
  const LogoClickHandler = () => {
    navigate('/');
  }

  const MyProfilePathClickHandler = () => {
    if (role === 'ROLE_ADMIN') navigate('/admin/profile');
    if (role === 'ROLE_USER') navigate(`/user/profile?userId=${loginUser?.userId}`);
    setDropdownVisible(false);
  }

  const onSignInButtonClickHandler = () => {
    navigate('/authentication/signin');
  }

  const onSignUpButtonClickHandler = () => {
    navigate('/authentication/signup');
  }

  const onSignOutButtonClickHandler = () => {
    resetLoginUser();
    setCookie('accessToken', '', { path: '/', expires: new Date() })
    navigate('/');
    setDropdownVisible(false);
  }

  const nicknamePathClickHandler = () => {
    setDropdownVisible(!dropdownVisible);
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'CHAT' && notification.chatRoomId) {
      navigate(`/chat?roomId=${notification.chatRoomId}&userId=`);
    } else if (notification.meetingBoardId && notification.meetingId) {
      navigate(`/meeting/board/detail/${notification.meetingId}/${notification.meetingBoardId}`);
    }
    setNotificationsModalOpen(!isNotificationsModalOpen);
  };

  const handleDeleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${loginUser?.userId}`, JSON.stringify(updatedNotifications));
  };

  const handleBellClick = () => {
    setNotificationsModalOpen(!isNotificationsModalOpen);
  };

  const NoticePathClickHandler = () => {
    navigate('/notice');
  }
  const FestivalPathClickHandler = () => {
    navigate('/festival/search');
  }
  const meetingPathClickHandler = () => {
    navigate('/meeting/list');
  }
  const inquirePathClickHandler = () => {
    navigate('/inquire');
  }

  return (
    <>
      <header className='header'>
        <div className='logo-container'>
          <img src={logoImage} alt="뒤로가기" onClick={LogoClickHandler} />
        </div>
        <div className="main-header">
          <div className="header-item">
            <span onClick={inquirePathClickHandler}>고객센터</span>
          </div>
          <div className="header-item">
            <span onClick={NoticePathClickHandler}>공지사항</span>
          </div>
          <div className="header-item">
            <span onClick={FestivalPathClickHandler}>축제</span>
          </div>
          <div className="header-item">
            <span onClick={meetingPathClickHandler}>모임</span>
          </div>
        </div>
        <div className='nav-container'>
          {!isLogin && <div onClick={onSignInButtonClickHandler}>로그인</div>}
          {!isLogin && <div onClick={onSignUpButtonClickHandler}>회원가입</div>}
          {isLogin && (
            <div className="header-user-info">
              <img className="notification" src={bellButton} alt='알림' onClick={handleBellClick} />
              <div className="nickname-container">
                {role === 'ROLE_ADMIN' && <span className="role">(관리자)</span>}
                <div className="nickname" onClick={nicknamePathClickHandler}>
                  {loginUser?.nickname}님
                </div>
              </div>
            </div>
          )}
        </div >
        {dropdownVisible && (
          <div className="dropdown-menu">
            <div>
              <div className='dropdown-menu-profile' onClick={MyProfilePathClickHandler}>프로필</div>
            </div>
            <div className='dropdown-menu-logout' onClick={onSignOutButtonClickHandler}>로그아웃</div>
          </div>
        )}
      </header >
      {isNotificationsModalOpen && (
        <NotificationsModal
          notifications={notifications}
          meetingBoardTitles={meetingBoardTitles}
          onNotificationClick={handleNotificationClick}
          onDeleteNotification={handleDeleteNotification}
          onClose={() => setNotificationsModalOpen(false)}
        />
      )}
    </>
  )
}
