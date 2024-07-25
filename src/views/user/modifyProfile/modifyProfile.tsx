import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploadRequest, GetUserRequest, PatchPasswordRequest, PatchUserRequest } from 'apis/apis';
import { PatchPasswordRequestDto, PatchUserRequestDto } from 'apis/request/user';
import { GetUserResponseDto, PatchUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response/response';
import useLoginUserStore from 'store/login-user.store';
import { useCookies } from 'react-cookie';
import Images from 'types/interface/image.interface';
import defaultProfileImage from 'assets/images/user.png';

export default function UserModifyProfile() {
    const { loginUser } = useLoginUserStore();
    const [userId, setUserId] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [cookies] = useCookies();

    useEffect(() => {
        if (!loginUser) return;
        setUserId(loginUser.userId);
    }, [loginUser]);

    const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        console.log(responseBody);
        const { code } = responseBody;
        if (code === 'NU') alert('존재하지 않는 유저입니다.');
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code !== 'SU') {
            navigate('/');
            return;
        }
        const { nickname, email, profileImage, phoneNumber } = responseBody as GetUserResponseDto;
        setNickname(nickname);
        setEmail(email);
        setProfileImage(profileImage);
        setPhoneNumber(phoneNumber);
    }

    const fileUploadResponse = (responseBody: string | Images | ResponseDto | null) => {
        if (!responseBody) return;
        if (typeof responseBody === 'string') {
            setProfileImage(responseBody);
        } else if ('image' in responseBody) {
            setProfileImage(responseBody.image || null);
        }
    }

    const patchUserResponse = (responseBody: PatchUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'VF') alert('입력한 정보가 유효하지 않습니다.');
        if (code === 'DN') alert('중복된 닉네임입니다.');
        if (code === 'NU') alert('존재하지 않는 유저입니다.');
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'SU') {
            alert('정보가 성공적으로 수정되었습니다.');
            GetUserRequest(userId).then(getUserResponse);
        }
    };

    const handleSubmit = () => {
        if (!userId) {
            alert('유저 ID를 입력하세요.');
            return;
        }
        if (!nickname) {
            alert('닉네임을 입력하세요.');
            return;
        }
        if (!email) {
            alert('이메일을 입력하세요.');
            return;
        }
        if(!phoneNumber) {
            alert('전화번호를 입력하세요.');
            return;
        }

        const requestBody: PatchUserRequestDto = {
            nickname,
            email,
            currentPassword,
            newPassword,
            profileImage,
            phoneNumber
        };

        PatchUserRequest(requestBody, cookies.accessToken).then(patchUserResponse);
    };

    const onProfileBoxClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    };

    const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;

        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file);

        FileUploadRequest(data).then(fileUploadResponse);
    }

    const patchPasswordResponse = (responseBody: ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'VF') alert('입력한 정보가 유효하지 않습니다.');
        if (code === 'WP') alert('비밀번호가 일치하지 않습니다.');
        if (code === 'NU') alert('존재하지 않는 유저입니다.');
        if (code === 'DBE') alert('데이터베이스 오류입니다.');
        if (code === 'SU') alert('비밀번호가 성공적으로 수정되었습니다.');
    }

    const onPatchPassword = () => {
        if (!userId) {
            alert('유저 ID를 입력하세요.');
            return;
        }
        if (!currentPassword) {
            alert('현재 비밀번호를 입력하세요.');
            return;
        }
        if (!newPassword) {
            alert('새 비밀번호를 입력하세요.');
            return;
        }

        const requestBody: PatchPasswordRequestDto = {
            currentPassword,
            newPassword
        };

        PatchPasswordRequest(requestBody, cookies.accessToken).then(patchPasswordResponse);
    }

    useEffect(() => {
        if (!userId) return;
        GetUserRequest(userId).then(getUserResponse);
    }, [userId]);

    return (
        <div>
            <h2>사용자 프로필 수정</h2>
            <div className='profile-image' onClick={onProfileBoxClickHandler}>
                <img src={profileImage ? profileImage : defaultProfileImage} alt="프로필 이미지" />
            </div>
            <input
                type="file"
                ref={imageInputRef}
                style={{ display: 'none' }}
                onChange={onProfileImageChangeHandler}
            />
            닉네임
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="새 닉네임 입력"
            />
            이메일
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="새 이메일 입력"
            />
            전화번호
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="전화번호 입력"
            />
            <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
            />
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력"
            />
            <button onClick={onPatchPassword}>비밀번호 수정</button>
            <button onClick={handleSubmit}>수정</button>
        </div>
    )
}
