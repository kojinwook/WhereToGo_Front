import { BlockUserRequest, DeleteUserRequest, GetUserListRequest, UnBlockUserRequest } from 'apis/apis';
import { BlockUserRequestDto, UnBlockUserRequestDto } from 'apis/request/user';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import User from 'types/interface/user.interface';
import './style.css';

export default function Management() {
    const { loginUser } = useLoginUserStore();
    const [userId, setUserId] = useState<string>('');
    const [userList, setUserList] = useState<User[]>([]);
    const [filteredUserList, setFilteredUserList] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('newest');
    const [cookies] = useCookies();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isBlocking, setIsBlocking] = useState<boolean>(false);
    const [blockDays, setBlockDays] = useState<string>('3');
    const [unBlocking, setUnBlocking] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [adminCode, setAdminCode] = useState<string>('');
    const navigate = useNavigate();
    const ADMIN_CONFIRMATION_CODE = '1234'; // 관리자 확인 코드 설정

    useEffect(() => {
        if (!loginUser) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (loginUser.role !== 'ROLE_ADMIN') {
            window.history.back();
        }
        setUserId(loginUser.userId);

        const fetchUserList = async () => {
            const response = await GetUserListRequest(cookies.accessToken);
            console.log(response)
            if (!response) return;
            setUserList(response.userList);
            setFilteredUserList(response.userList);
        };
        fetchUserList();
    }, [userList.length]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        filterUsers(event.target.value, sortOrder);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value);
        filterUsers(searchTerm, event.target.value);
    };

    const filterUsers = (searchTerm: string, sortOrder: string) => {
        let filteredUsers = userList.filter(user =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortOrder === 'newest') {
            filteredUsers.sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
        } else if (sortOrder === 'oldest') {
            filteredUsers.sort((a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime());
        } else if (sortOrder === 'temperature-asc') {
            filteredUsers.sort((a, b) => a.temperature - b.temperature);
        } else if (sortOrder === 'temperature-desc') {
            filteredUsers.sort((a, b) => b.temperature - a.temperature);
        }

        setFilteredUserList(filteredUsers);
    };

    const openModal = (userId: string, isBlocking: boolean, unBlocking: boolean = false) => {
        setCurrentUserId(userId);
        setIsBlocking(isBlocking);
        setUnBlocking(unBlocking);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setAdminCode('');
        setBlockDays('3');
    };

    const handleAdminCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdminCode(event.target.value);
    };

    const handleBlockDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        setBlockDays((event.target.value));
    };

    const handleDelete = async () => {
        window.confirm('정말로 강퇴하시겠습니까?');
        if (adminCode !== ADMIN_CONFIRMATION_CODE) {
            alert('확인 코드가 일치하지 않습니다.');
            return;
        }
        const response = await DeleteUserRequest(currentUserId, cookies.accessToken);
        if (!response) return;
        alert('강퇴되었습니다.');
        closeModal();
        const updatedUserList = userList.filter(user => user.userId !== currentUserId);
        setUserList(updatedUserList);
        setFilteredUserList(updatedUserList);
    };

    const handleBlock = async () => {
        window.confirm('정말로 블랙하시겠습니까?');
        if (adminCode !== ADMIN_CONFIRMATION_CODE) {
            alert('확인 코드가 일치하지 않습니다.');
            return;
        }
        const requestBody: BlockUserRequestDto = { userId: currentUserId, blockDays: blockDays };
        const response = await BlockUserRequest(requestBody, cookies.accessToken);
        console.log(response)
        if (!response) return;
        if (response.code === 'SU') {
            alert('블랙 처리되었습니다.');
        } else {
            alert('블랙 처리에 실패했습니다.');
        }
        closeModal();
        const updatedUserList = userList.map(user =>
            user.userId === currentUserId ? { ...user, isBlocked: true } : user
        );
        setUserList(updatedUserList);
        setFilteredUserList(updatedUserList);
    };

    const handleUnBlock = async () => {
        window.confirm('정말로 블랙을 해제하시겠습니까?');
        if (adminCode !== ADMIN_CONFIRMATION_CODE) {
            alert('확인 코드가 일치하지 않습니다.');
            return;
        }
        const requestBody: UnBlockUserRequestDto = { userId: currentUserId };
        const response = await UnBlockUserRequest(requestBody, cookies.accessToken);
        console.log(response)
        if (!response) return;
        if (response.code === 'SU') {
            alert('블랙이 해제되었습니다.');
        } else {
            alert('블랙 해제에 실패했습니다.');
        }
        closeModal();
        const updatedUserList = userList.map(user =>
            user.userId === currentUserId ? { ...user, isBlocked: false } : user
        );
        setUserList(updatedUserList);
        setFilteredUserList(updatedUserList);
    }

    const formatDate = (createDateTime: string) => {
        const isoDate = createDateTime;
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const nicknameClickHandler = (userId: string) => {
        navigate(`/user/profile?userId=${userId}`);
    };

    const reportListClickHandler = (nickname: string) => {
        navigate(`/admin/report/${nickname}`);
    }

    if (loginUser?.role !== "ROLE_ADMIN") return null;

    return (
        <div className='manage-container'>
            <div className='manage-header'>
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="newest">가입 최신순</option>
                    <option value="oldest">가입 오래된순</option>
                    <option value="temperature-asc">온도 낮은 순</option>
                    <option value="temperature-desc">온도 높은 순</option>
                </select>
                <input
                    type="text"
                    placeholder="유저 닉네임으로 검색"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div>
                <table className='manage-table'>
                    <thead className='manage-list'>
                        <tr>
                            <th>번호</th>
                            <th>이메일</th>
                            <th>닉네임</th>
                            <th>가입일</th>
                            <th>온도</th>
                            <th>신고누적</th>
                            <th>블랙</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody className='manage-content'>
                        {filteredUserList.map((user, index) => (
                            <tr key={index}>
                                <td>{filteredUserList.length - index}</td>
                                <td>{user.email}</td>
                                <td onClick={() => nicknameClickHandler(user.userId)}>{user.nickname}</td>
                                <td>{formatDate(user.createDate)}</td>
                                <td>{user.temperature} ℃</td>
                                <td>{user.reportCount} 회</td>
                                <td>{user.isBlocked ? 'O' : 'X'}</td>
                                <td>
                                    <button className='ejection' onClick={() => openModal(user.userId, false)}>강퇴</button>
                                    {user.isBlocked ? (
                                        <button onClick={() => openModal(user.userId, false, true)}>블랙 해제</button>
                                    ) : (
                                        <button onClick={() => openModal(user.userId, true)}>블랙</button>
                                    )}
                                    <button onClick={() => reportListClickHandler(user.nickname)}>신고목록</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>관리자 확인 코드 입력</h2>
                        <input
                            type="password"
                            placeholder="확인 코드"
                            value={adminCode}
                            onChange={handleAdminCodeChange}
                        />
                        {isBlocking && !unBlocking && (
                            <>
                                <input
                                    type="number"
                                    placeholder="블록 일수"
                                    value={blockDays}
                                    onChange={handleBlockDaysChange}
                                    min="1"
                                />
                            </>
                        )}
                        <button onClick={isBlocking ? handleBlock : (unBlocking ? handleUnBlock : handleDelete)}>확인</button>
                        <button onClick={closeModal}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}
