import { RecoveryPasswordRequest, SignInRequest } from 'apis/apis';
import SignInRequestDto from 'apis/request/auth/sign-in.request.dto';
import PasswordRecoveryRequestDto from 'apis/request/user/password-recovery.request.dto';
import SignInResponseDto from 'apis/response/auth/sign-in.response.dto';
import PasswordRecoveryResponseDto from 'apis/response/user/password-recovery.response.dto';
import InputBox from 'components/InputBox';
import React, { ChangeEvent, useRef, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ResponseBody } from 'types';
import { ResponseCode } from 'types/enums/enums';

export default function SignIn() {

  const userIdRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [cookie, setCookie] = useCookies();
  const [email, setEmail] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordType, setPasswordType] = useState<'text' | 'password'>('password');
  const [showRecoveryBox, setShowRecoveryBox] = useState(false);
  const [EmailMessage, setEmailMessage] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const [isPasswordError, setIsPasswordError] = useState<boolean>(false); const signInResponse = (responseBody: ResponseBody<SignInResponseDto>) => {

    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디와 비밀번호를 입력하세요.');
    if (code === ResponseCode.SING_IN_FAIL) setMessage('로그인 정보가 일치하지 않습니다.');
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;

    const { token, expirationTime } = responseBody as SignInResponseDto;

    const now = (new Date().getTime()) * 1000;
    const expires = new Date(now + expirationTime);

    setCookie('accessToken', token, { expires, path: `/` });
    navigate(`/`);
    alert('로그인 되었습니다.');
  }

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserId(value);
    setMessage('');
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setMessage('');
  };

  const onSignInButtonClickHandler = () => {

    if (!userId || !password) {
      alert('아이디와 비밀번호 모두 입력하세요.');
      return;
    }
    const requestBody: SignInRequestDto = { userId, password };
    SignInRequest(requestBody).then(signInResponse);
  };

  const onSignUpButtonClickHandler = () => {
    navigate('/signup');
  };

  const onIdKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    if (!passwordRef.current) return;
    passwordRef.current.focus();
  };
  const onPasswordKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    onSignInButtonClickHandler();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const recoverPasswordResponse = (responseBody: ResponseBody<PasswordRecoveryResponseDto>) => {
    if (!responseBody) return;

    const { code } = responseBody;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('올바른 이메일 형식이 아닙니다.');
        return;
    }
    if (code === 'VF') alert('이메일을 입력하세요.');
    if (code === 'DBE') alert('데이터베이스 오류입니다.');
    if (code === 'NU') {
        setIsEmailError(true);
        setEmailMessage('가입되지 않은 이메일입니다.');
    }
    if (code === 'SU') {
        setIsEmailError(false);
        setEmailMessage('이메일 전송 완료');
    }
};

const onRecoverPasswordButtonClickHandler = async (email: string) => {
  if (!email) {
      setIsEmailError(true);
      setEmailMessage('이메일을 입력하세요.');
      return;
  }
  const requestBody: PasswordRecoveryRequestDto = { email };
  RecoveryPasswordRequest(requestBody).then(recoverPasswordResponse);
  setIsEmailError(false);
  setEmailMessage('이메일 전송중...');
};

const handleRecoverPassword = async () => {
  await onRecoverPasswordButtonClickHandler(email);
};

const onRecoverPasswordKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  handleRecoverPassword();
}

const toggleRecoveryBox = () => {
  setShowRecoveryBox(!showRecoveryBox);
};

return (
  <div className="sign-in-container">
      <div className="sign-in-box">
          <div className='sign-in-content-box'>
              <div className='sign-in-content-input-box'>
                  <div>
                      <InputBox ref={userIdRef} title='아이디' placeholder='아이디를 입력해주세요' type='text' value={userId} onChange={onIdChangeHandler} onKeyDown={onIdKeyDownHandler} />
                      <InputBox ref={passwordRef} title='비밀번호' placeholder='비밀번호를 입력해주세요' type={passwordType} value={password} onChange={onPasswordChangeHandler} isErrorMessage message={message} onKeyDown={onPasswordKeyDownHandler} />
                  </div>
                  <div className='sign-in-content-button-box'>
                      <div className='sign-in-button full-width' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
                      <div className='sign-up-button full-width' onClick={onSignUpButtonClickHandler}>{'회원가입 하기'}</div>
                      <div className="text-link-lg-right recovery-password-button" onClick={toggleRecoveryBox}>{'비밀번호 찾기'}</div>
                  </div>
                  {showRecoveryBox && (
          <div className="recovery-password-box">
              <InputBox ref={emailRef} title="이메일" placeholder="이메일을 입력하세요." type="email" value={email} onChange={handleEmailChange} isErrorMessage={isEmailError} message={EmailMessage} onKeyDown={onRecoverPasswordKeyDownHandler} />
              <div className="primary-button-small recovery-password-button" onClick={handleRecoverPassword}>{'비밀번호 찾기'}</div>
          </div>
      )}
              </div>
          </div>
      </div>
  </div>
)
}
