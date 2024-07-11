import { ChangeEvent, KeyboardEvent, forwardRef } from "react";
import './style.css';
import React from "react";
interface Props{
    title: string,
    placeholder: string;
    type: 'text' | 'password' | 'email';
    value: string;
    isErrorMessage?: boolean;
    buttonTitle?: string;
    message?: string
    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;
}

const SignBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    const{title, type, value, isErrorMessage, buttonTitle, message, onChange, onKeyDown, onButtonClick} = props;

    const buttonClass = value === '' ? 'sign-box-button-disable' : 'sign-box-button';
    const messageClass = isErrorMessage ? 'sign-box-message-error' : 'sign-box-message';

    return(
        <div className='signBox'>
            <div className='sign-box-content'>
                <div className='sign-box-body'>
                    <input ref={ref} className="sign-box-input" placeholder={title} type={type} value={value} onChange={onChange} onKeyDown={onKeyDown}/>
                    {buttonTitle !== undefined && onButtonClick !== undefined && <div className={buttonClass} onClick={onButtonClick}>{buttonTitle}</div>}
                </div>
                {message !== undefined && <div className={messageClass}>{message}</div>}
            </div>
        </div>
    )
});

export default SignBox;