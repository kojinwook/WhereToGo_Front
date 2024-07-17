import { FileUploadRequest, GetMeetingRequest, PatchMeetingRequest } from 'apis/apis';
import { log } from 'console';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import useMeetingStore from 'store/meeting.store';
import Images from 'types/interface/image.interface';
import Meeting from 'types/interface/meeting.interface';

export default function MeetingUpdate() {

    const { meetingId } = useParams();
    const { loginUser } = useLoginUserStore();
    const [meeting, setMeeting] = useState<Meeting>();
    const [title, setTitle] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [content, setContent] = useState("");
    const [nickname, setNickname] = useState("");
    const [imageFileList, setImageFileList] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        if (!meetingId) return;
        const fetchMeeting = async () => {
            try {
                const response = await GetMeetingRequest(meetingId);
                const { title, introduction, content, userNickname, imageList, maxParticipants, tags, areas } = response.meeting;
                if (response.code === 'SU') {
                    setTitle(title);
                    setIntroduction(introduction);
                    setContent(content);
                    setNickname(userNickname);
                    const imageUrls = imageList.map((image: Images) => image.image);
                    setImagePreviews(imageUrls);
                    setMaxParticipants(maxParticipants);
                    setTags(tags);
                    setAreas(areas);
                    setMeeting(response.meeting);
                }
            } catch (error) {
                console.error('Error fetching meeting list:', error);
            }
        }
        fetchMeeting();
    }, [meetingId])

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const handleIntroductionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setIntroduction(e.target.value);
    }

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }

    const handleMaxParticipants = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (value > 20) {
            alert('최대 인원은 20명으로 제한됩니다.');
            setMaxParticipants(20);
        } else {
            setMaxParticipants(value);
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags(e.target.value.split(','));
    }

    const handleAreasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAreas(e.target.value.split(','));
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


    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = e.currentTarget.value.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
                e.currentTarget.value = '';
            }
        }
    };

    const handleAreasKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newAreas = e.currentTarget.value.trim();
            if (newAreas && !tags.includes(newAreas)) {
                setAreas([...areas, newAreas]);
                e.currentTarget.value = '';
            }
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const removeArea = (area: string) => {
        setAreas(areas.filter(a => a !== area));
    };

    const updateButtonHandler = async () => {
        if (!meetingId) return;
        if (!loginUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        const imageList: Images[] = [];
        for (const file of imageFileList) {
            const formData = new FormData();
            formData.append('file', file);
            const imageUrl = await FileUploadRequest(formData);
            if (imageUrl) {
                imageList.push(imageUrl);
            }
        }
        const requestBody = { title, introduction, content, nickname, imageList, maxParticipants, tags, areas };
        const response = await PatchMeetingRequest(meetingId, requestBody, cookies.accessToken);
        if (response.code === 'SU') {
            alert('성공적으로 수정되었습니다.');
            navigate(`/meeting/detail/${meetingId}`);
        } else {
            alert('수정에 실패했습니다.');
        }
    }

    return (
        <div>
            <div className='meeting-write-container'>
                <p><strong>모임 명</strong></p>
                <input
                    type="text"
                    placeholder="모임 명을 입력해주세요."
                    value={title}
                    onChange={handleTitleChange}
                />

                <br />

                <p><strong>한 줄 소개</strong></p>
                <label>
                    <textarea
                        placeholder='한 줄 소개'
                        value={introduction}
                        onChange={handleIntroductionChange}
                    ></textarea>
                </label>

                <br />

                <p><strong>내용</strong></p>
                <label>
                    <textarea
                        placeholder='내용'
                        value={content}
                        onChange={handleContentChange}
                    ></textarea>
                </label>

                <br />

                <p><strong>최대 인원</strong></p>
                <input
                    type="number"
                    placeholder="최대 인원을 입력해주세요."
                    value={maxParticipants}
                    onChange={handleMaxParticipants}
                    min={1}
                    max={20}
                />

                <br />

                <p><strong>태그</strong></p>
                <input
                    type="text"
                    placeholder="태그를 입력해주세요. (Enter로 추가)"
                    name="tags"
                    onKeyDown={handleTagKeyDown} />
                <div>
                    {tags.map((tag, index) => (
                        <div key={index}>
                            #{tag}
                            <span onClick={() => removeTag(tag)}>&times;</span>
                        </div>
                    ))}
                </div>

                <br />

                <p><strong>지역</strong></p>
                <input
                    type="text"
                    placeholder="지역을 입력해주세요. (Enter로 추가)"
                    name="areas"
                    onKeyDown={handleAreasKeyDown} />
                <div>
                    {areas.map((areas, index) => (
                        <div key={index}>
                            #{areas}
                            <span onClick={() => removeArea(areas)}>&times;</span>
                        </div>
                    ))}
                </div>

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

                <button onClick={updateButtonHandler}>등록</button>
            </div>
        </div>
    )
}
