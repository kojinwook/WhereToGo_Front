import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import User from 'types/interface/user.interface';
import { DeleteUserRequest, GetUserListRequest } from 'apis/apis';
import useLoginUserStore from 'store/login-user.store';
import { useNavigate } from 'react-router-dom';

export default function Management() {
    const { loginUser } = useLoginUserStore();
    const [userId, setUserId] = useState<string>('');
    const [userList, setUserList] = useState<User[]>([]);
    const [filteredUserList, setFilteredUserList] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<string>('newest');
    const [cookies] = useCookies();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [adminCode, setAdminCode] = useState<string>('');
    const navigate = useNavigate();
    const ADMIN_CONFIRMATION_CODE = '1234'; // 관리자 확인 코드 설정

    useEffect(() => {
        if (!loginUser) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (loginUser && loginUser.role !== 'ROLE_ADMIN') {
            alert('관리자만 접근 가능합니다.');
        }
        setUserId(loginUser.userId);
    }, [loginUser]);

    useEffect(() => {
        const fetchUserList = async () => {
            const response = await GetUserListRequest(cookies.accessToken);
            if (!response) return;
            setUserList(response.userList);
            setFilteredUserList(response.userList);
        };
        fetchUserList();
    }, [cookies.accessToken]);

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
        } else {
            filteredUsers.sort((a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime());
        }
        setFilteredUserList(filteredUsers);
    };

    const openModal = (userId: string) => {
        setCurrentUserId(userId);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setAdminCode('');
    };

    const handleAdminCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdminCode(event.target.value);
    };

    const handleDelete = async () => {
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

    return (
        <div>
            <div>
                <h1>회원 목록</h1>
                <input
                    type="text"
                    placeholder="유저 닉네임으로 검색"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="newest">가입 최신순</option>
                    <option value="oldest">가입 오래된순</option>
                </select>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>이메일</th>
                            <th>닉네임</th>
                            <th>가입일</th>
                            <th>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUserList.map((user, index) => (
                            <tr key={index}>
                                <td>{filteredUserList.length - index}</td>
                                <td>{user.email}</td>
                                <td onClick={() => nicknameClickHandler(user.userId)}>{user.nickname}</td>
                                <td>{formatDate(user.createDate)}</td>
                                <td>
                                    <button onClick={() => openModal(user.userId)}>강퇴</button>
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
                        <button onClick={handleDelete}>확인</button>
                        <button onClick={closeModal}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}
