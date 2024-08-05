import { FileUploadRequest, PostMeetingBoardRequest } from 'apis/apis';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store'
import { Images } from 'types/interface/interface';
import './style.css';

export default function BoardWrite() {
    const { meetingId } = useParams()
    const { loginUser } = useLoginUserStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [address, setAddress] = useState("");
    const [imageFileList, setImageFileList] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    }

    const handleAddress = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAddress(event.target.value);
    }

    const handleContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const files = Array.from(event.target.files);
        setImageFileList(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleImageRemove = (index: number) => {
        const newImageFileList = [...imageFileList];
        newImageFileList.splice(index, 1);
        setImageFileList(newImageFileList);

        const newImagePreviews = [...imagePreviews];
        newImagePreviews.splice(index, 1);
        setImagePreviews(newImagePreviews);
    };

    const handlePost = async () => {
        if (!loginUser || !cookies.accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!meetingId) return;
        const formData = new FormData();
        formData.append('title', title);
        formData.append('address', address);
        formData.append('content', content);

        const imageList: Images[] = [];
        for (const file of imageFileList) {
            const formData = new FormData();
            formData.append('file', file);
            const imageUrl = await FileUploadRequest(formData);
            if (imageUrl) {
                imageList.push(imageUrl);
            }
        }

        try {
            const requestBody = { title, address, content, imageList };
            const response = await PostMeetingBoardRequest(meetingId, requestBody, cookies.accessToken);
            if (!response) return;
            if (response.code === 'SU') {
                alert('게시물이 성공적으로 등록되었습니다.');
                navigate(`/meeting/detail/${meetingId}`);
            } else {
                alert('게시물 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('게시물 등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className='board-write-container'>
            <p>게시물 작성</p>
            <div className='board-write-list'>
                <p><strong>제목</strong></p>
                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={handleTitle}
                />
                <br />
                <p><strong>내용</strong></p>
                <label>
                    <textarea
                        placeholder='내용'
                        value={content}
                        onChange={handleContent}
                    ></textarea>
                </label>
                <br />
                <p><strong>주소</strong></p>
                <label>
                    <textarea
                        placeholder='주소'
                        value={address}
                        onChange={handleAddress}
                    ></textarea>
                </label>
                <br />
                <p><strong>사진</strong></p>
                <input type="file" multiple onChange={handleImageChange} />
                <div className='image-preview-container'>
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className='image-preview'>
                            <img
                                src={preview}
                                alt={`이미지 미리보기 ${index}`}
                            />
                            <button onClick={() => handleImageRemove(index)}>
                                <i className="fas fa-times-circle" />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={handlePost}>등록</button>
            </div>
        </div>
    )
}
