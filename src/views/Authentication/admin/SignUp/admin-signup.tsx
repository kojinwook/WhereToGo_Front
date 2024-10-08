import { AdminSignUpRequest, CheckCertificationRequest, EmailCertificationRequest, NicknameCheckRequest, UserIdCheckRequest } from 'apis/apis';
import AdminSignUpRequestDto from 'apis/request/auth/admin-sign-up.request.dto';
import CheckCertificationRequestDto from 'apis/request/auth/check-certification.request.dto';
import EmailCertificationRequestDto from 'apis/request/auth/email-certification.request.dto';
import nicknameCheckRequestDto from 'apis/request/auth/nickname-check.request.dto';
import userIdCheckRequestDto from 'apis/request/auth/userId-check.request.dto';
import { AdminSignUpResponseDto, CheckCertificationResponseDto, EmailCertificationResponseDto, NicknameCheckResponseDto } from 'apis/response/auth';
import nicknameCheckResponseDto from 'apis/response/auth/nickname-check.response.dto';
import phoneCheckResponseDto from 'apis/response/auth/phone-check.response.dto';
import userIdCheckResponseDto from 'apis/response/auth/userId-check.response.dto';
import SignBox from 'components/SignBox';
import React, { ChangeEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ResponseBody } from 'types';
import ResponseCode from 'types/enums/response-code.enum';
import './style.css'

export default function AdminSignUp() {
  const userIdRef = useRef<HTMLInputElement | null>(null);
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const certificationNumberRef = useRef<HTMLInputElement | null>(null);
  const secretKeyRef = useRef<HTMLInputElement | null>(null);

  const [userId, setUserId] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [certificationNumber, setCertificationNumber] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [agreedPersonal, setAgreedPersonal] = useState<boolean>(false);
  const [isUserIdError, setUserIdError] = useState<boolean>(false);
  const [isNicknameError, setNicknameError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
  const [isEmailError, setEmailError] = useState<boolean>(false);
  const [isPhoneError, setPhoneError] = useState<boolean>(false);
  const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);
  const [isSecretKeyError, setSecretKeyError] = useState<boolean>(false);
  const [isAgreedPersonalError, setAgreedPersonalError] = useState<boolean>(false);
  const [userIdMessage, setUserIdMessage] = useState<string>('');
  const [NicknameMessage, setNicknameMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [EmailMessage, setEmailMessage] = useState<string>('');
  const [PhoneMessage, setPhoneMessage] = useState<string>('');
  const [CertificationNumberMessage, setCertificationNumberMessage] = useState<string>('');
  const [SecretKeyMessage, setSecretKeyMessage] = useState<string>('');
  const [isUserIdCheck, setUserIdCheck] = useState<boolean>(false);
  const [isNicknameCheck, setNicknameCheck] = useState<boolean>(false);
  const [isPhoneCheck, setPhoneCheck] = useState<boolean>(false);
  const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);
  const [isSecretKeyCheck, setSecretKeyCheck] = useState<boolean>(false);

  const signUpButtonClass = userId && password && nickname && passwordCheck && email && phone && certificationNumber && secretKey ?
    'primary-button-lg' : 'disable-button-lg';

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

  const navigate = useNavigate();

  const userIdCheckResponse = (responseBody: ResponseBody<userIdCheckResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디를 입력하세요.');
    if (code === ResponseCode.DUPLICATE_ID) {
      setUserIdError(true);
      setUserIdMessage('이미 사용중인 아이디 입니다.');
      setUserIdCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;
    setUserIdError(false);
    setUserIdMessage('사용 가능한 아이디 입니다.');
    setUserIdCheck(true);
  };

  const PhoneCheckResponse = (responseBody: ResponseBody<phoneCheckResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('전화번호를 입력하세요.');
    if (code === ResponseCode.DUPLICATE_PHONE) {
      setPhoneError(true);
      setPhoneMessage('이미 사용중인 전화번호 입니다.');
      setPhoneCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;
    setPhoneError(false);
    setPhoneMessage('사용 가능한 전화번호 입니다.');
    setPhoneCheck(true);
  };

  const nicknameCheckResponse = (responseBody: ResponseBody<nicknameCheckResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('닉네임을 입력하세요.');
    if (code === ResponseCode.DUPLICATE_NICKNAME) {
      setNicknameError(true);
      setNicknameMessage('이미 사용중인 닉네임 입니다.');
      setNicknameCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;
    setNicknameError(false);
    setNicknameMessage('사용 가능한 닉네임 입니다.');
    setNicknameCheck(true);
  };



  const emailCertificationResponse = (responseBody: ResponseBody<EmailCertificationResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디와 이메일을 모두 입력하세요.');
    if (code === ResponseCode.MAIL_FAIL || code === ResponseCode.DATABASE_ERROR) {
      setEmailError(true);
      setEmailMessage('이메일 전송에 실패했습니다.');
    }
    if (code === ResponseCode.DUPLICATE_EMAIL)
      setEmailError(true);
    setEmailMessage('이미 사용중인 이메일 입니다.');
    if (code !== ResponseCode.SUCCESS) return;
    setEmailError(false);
    setEmailMessage('인증번호가 전송되었습니다.');
  };

  const checkCertificationResponse = (responseBody: ResponseBody<CheckCertificationResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('아이디, 이메일, 인증번호를 모두 입력하세요.');
    if (code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다.');
      setCertificationCheck(false);
    }
    if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
    if (code !== ResponseCode.SUCCESS) return;
    setCertificationNumberError(false);
    setCertificationNumberMessage('인증번호가 확인되었습니다.');
    setCertificationCheck(true);
  };

  const adminSignUpResponse = (responseBody: ResponseBody<AdminSignUpResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === ResponseCode.VALIDATION_FAIL) alert('모든 값을 입력하세요.');
    if (code === ResponseCode.DO_NOT_HAVE_PERMISSION) {
      setSecretKeyError(true);
      setSecretKeyMessage('시크릿 키가 일치하지 않습니다.');
      setSecretKeyCheck(false);
    }
    if (responseBody.code !== ResponseCode.SUCCESS) return;
    setSecretKeyError(false);
    setSecretKeyMessage('시크릿 키가 확인되었습니다.');
    setSecretKeyCheck(true);
    navigate(`/authentication/signin`);
    alert('회원가입이 완료되었습니다.');
  };

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUserId(value);
    setUserIdMessage('');
    setUserIdCheck(false);
  };

  const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNickname(value);
    setNicknameMessage('');
    setNicknameCheck(false);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordMessage('');
  };

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordCheck(value);
    setPasswordCheckMessage('');
  };

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailMessage('');
  };

  const onPhoneChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPhone(value);
    setPhoneMessage('');
  };

  const onCertificationNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCertificationNumber(value);
    setCertificationNumberMessage('');
    setCertificationCheck(false);
  };

  const onSecretKeyChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSecretKey(value);
    setSecretKeyMessage('');
    setSecretKeyCheck(false);
  };

  const onIdButtenClickHandler = () => {
    if (!userId) return;
    const requestBody: userIdCheckRequestDto = { userId };
    UserIdCheckRequest(requestBody).then(userIdCheckResponse);
  };

  const onNicknameButtenClickHandler = () => {
    if (!nickname) return;
    const requestBody: nicknameCheckRequestDto = { nickname };
    NicknameCheckRequest(requestBody).then(nicknameCheckResponse);
  };

  const onEmailButtenClickHandler = () => {
    if (!userId || !email) return;
    const checkedEmail = emailPattern.test(email);
    if (!checkedEmail) {
      setEmailError(true);
      setEmailMessage('이메일 형식이 아닙니다.');
      return;
    }
    const requestBody: EmailCertificationRequestDto = { userId, email };
    EmailCertificationRequest(requestBody).then(emailCertificationResponse);
    setEmailError(false);
    setEmailMessage('이메일 전송중...');
  };

  const onCertificationNumberButtenClickHandler = () => {
    if (!userId || !email || !certificationNumber) return;
    const requestBody: CheckCertificationRequestDto = { userId, email, certificationNumber };
    CheckCertificationRequest(requestBody).then(checkCertificationResponse);
};

const onAgreedPersonalClickHandler = () => {
  setAgreedPersonal(!agreedPersonal);
  setAgreedPersonalError(false);
};

const onSignUpButtonClickHandler = () => {
  if (!userId || !nickname || !password || !passwordCheck || !email || !certificationNumber || !secretKey) return;
  if (!isUserIdCheck) {
      alert('중복 확인은 필수입니다.');
      return;
  }
  if (!isNicknameCheck) {
      alert('중복 확인은 필수입니다.');
      return;
  }
  const checkedPassword = passwordPattern.test(password);
  if (!checkedPassword) {
      setPasswordError(true);
      setPasswordMessage('영문, 숫자를 혼용하여 8 ~ 13자 입력해주세요.');
      return;
  }
  if (password !== passwordCheck) {
      setPasswordError(true);
      setPasswordMessage('비밀번호가 일치하지 않습니다.');
      return;
  }
  if (!isCertificationCheck) {
      alert('이메일 인증은 필수입니다.');
      return;
  }
  const requestBody: AdminSignUpRequestDto = { userId, nickname, password, email, certificationNumber, phone, secretKey};
  AdminSignUpRequest(requestBody).then(adminSignUpResponse)
}; 

const onIdKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  onIdButtenClickHandler();
};

const onNicknameKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  onNicknameButtenClickHandler();
};

const onPasswordKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  if (!passwordCheckRef.current) return;
  passwordCheckRef.current.focus();
};

const onPasswordCheckKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  if (!emailRef.current) return;
  emailRef.current.focus();
};

const onEmailKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  onEmailButtenClickHandler();
};

const onCertificationNumberKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key !== 'Enter') return;
  onCertificationNumberButtenClickHandler();
};

return ( 
  <div className='admin-sign-up-container'>
      <div className='admin-sign-up-box'>
          <div className='sign-up-title'>{'관리자 회원가입'}</div>
          <div className='sign-up-content-box'>
              <div className='sign-up-content-divider'></div>
              <div className='sign-up-content-input-box'>
                <div className='admin-input-container'>
                  <SignBox ref={userIdRef} title='아이디' placeholder='아이디를 입력해주세요' type='text' value={userId} onChange={onIdChangeHandler} isErrorMessage={isUserIdError} message={userIdMessage} buttonTitle='중복 확인' onButtonClick={onIdButtenClickHandler} onKeyDown={onIdKeyDownHandler} />
                </div>
                <div className='admin-input-container'>
                  <SignBox ref={nicknameRef} title='닉네임' placeholder='닉네임을 입력해주세요' type='text' value={nickname} onChange={onNicknameChangeHandler} isErrorMessage={isNicknameError} message={NicknameMessage} buttonTitle='중복 확인' onButtonClick={onNicknameButtenClickHandler} onKeyDown={onNicknameKeyDownHandler} />
                </div>
                <div className='admin-input-container'>
                  <SignBox ref={passwordRef} title='비밀번호' placeholder='비밀번호를 입력해주세요' type='password' value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} onKeyDown={onPasswordKeyDownHandler} />
                </div>
                <div className='admin-input-container'>
                  <SignBox ref={passwordCheckRef} title='비밀번호 확인' placeholder='비밀번호를 입력해주세요' type='password' value={passwordCheck} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} onKeyDown={onPasswordCheckKeyDownHandler} />
                </div>
                <div className='admin-input-container'>
                  <SignBox ref={phoneRef} title='전화번호' placeholder='전화번호를 입력해주세요' type='text' value={phone} onChange={onPhoneChangeHandler} isErrorMessage={isPhoneError} message={PhoneMessage} />
                </div>
                <div className='admin-input-container'>
                  <SignBox ref={emailRef} title='이메일' placeholder='이메일 주소를 입력해주세요' type='text' value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={EmailMessage} buttonTitle='이메일 인증' onButtonClick={onEmailButtenClickHandler} onKeyDown={onEmailKeyDownHandler} />
                </div>
                <div className='admin-input-container'>
                  <SignBox ref={certificationNumberRef} title='인증번호' placeholder='인증번호 4자리를 입력해주세요' type='text' value={certificationNumber} onChange={onCertificationNumberChangeHandler} isErrorMessage={isCertificationNumberError} message={CertificationNumberMessage} buttonTitle='인증 확인' onButtonClick={onCertificationNumberButtenClickHandler} onKeyDown={onCertificationNumberKeyDownHandler} />
                </div>
                <div className='admin-input-container'>
                  <SignBox ref={secretKeyRef} title='시크릿 키' placeholder='시크릿 키를 입력해주세요' type='text' value={secretKey} onChange={onSecretKeyChangeHandler} isErrorMessage={isSecretKeyError} message={SecretKeyMessage} />
                </div>
              </div>
              <div className="auth-consent-box">
                <div className="auth-check-box" onClick={onAgreedPersonalClickHandler}>
                    <div className={`icon ${agreedPersonal ? 'check-round-fill-icon' : 'check-ring-light-icon'}`}></div>
                </div>
                <div className={isAgreedPersonalError ? "auth-consent-title-error" : "auth-consent-title"}>
                    {'개인정보동의'}
                </div>
                <div className="auth-consent-link">{'더보기 >'}</div>
              </div>
              <div className='admin-sign-up-content-button-box'>
                  <div className={signUpButtonClass + ' full-width'} onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
              </div>
          </div>
      </div>
  </div>
);
}
