import { FileUploadRequest, GetMeetingBoardRequest, PatchMeetingBoardRequest } from 'apis/apis'
import { PatchMeetingBoardRequestDto } from 'apis/request/meeting/board'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Images } from 'types/interface/interface';

export default function BoardUpdate() {

    const { meetingBoardId } = useParams();
    const { loginUser } = useLoginUserStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [address, setAddress] = useState("");
    const [imageFileList, setImageFileList] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoard = async () => {
            if (!meetingBoardId) return;
            const response = await GetMeetingBoardRequest(meetingBoardId);
            if (!response) return;
            if (response.code === 'SU') {
                setTitle(response.meetingBoard.title);
                setContent(response.meetingBoard.content);
                setAddress(response.meetingBoard.address);
                const previews = response.meetingBoard.imageList.map((imageObj: { image: string }) => imageObj.image);
                setImagePreviews(previews);
            }
        }
        fetchBoard();
    }, [])

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

    const onUpdateBoardButtonClickHandler = async () => {
        if (!loginUser || !cookies.accessToken) {
            alert('로그인이 필요합니다.');
            return;
        }

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

        if (!meetingBoardId) return;
        const requestBody: PatchMeetingBoardRequestDto = {
            title: title,
            content: content,
            address: address,
            imageList: imageList,
        }
        const response = await PatchMeetingBoardRequest(meetingBoardId, requestBody, cookies.accessToken)
        if (!response) return;
        if (response.code === 'SU') {
            alert('게시물이 성공적으로 수정되었습니다.');
            navigate('/meeting/board/list/${meetingId}');
        } else {
            alert('게시물 수정에 실패했습니다.');
        }
    }



    return (
        <div>
            <div>
            <div>
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
                <div style={{ display: 'flex', marginTop: '10px' }}>
                    {imagePreviews.map((preview, index) => (
                        <div key={index} style={{ position: 'relative', marginRight: '10px', marginBottom: '10px' }}>
                            <img
                                src={preview}
                                alt={`이미지 미리보기 ${index}`}
                                style={{ width: '100px', height: 'auto', marginRight: '10px' }}
                            />
                            <button
                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
                                onClick={() => handleImageRemove(index)}
                            >
                                <i className="fas fa-times-circle" style={{ fontSize: '1.5rem', color: 'gray' }} />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={onUpdateBoardButtonClickHandler}>수정</button>
            </div>
        </div>
        </div>
    )
}
