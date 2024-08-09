import { FileUploadRequest, GetMeetingRequest, PatchMeetingRequest } from 'apis/apis';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import Images from 'types/interface/image.interface';
import Meeting from 'types/interface/meeting.interface';

export default function MeetingUpdate() {

    const { meetingId } = useParams();
    const { loginUser } = useLoginUserStore();
    const [title, setTitle] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [content, setContent] = useState("");
    const [nickname, setNickname] = useState("");
    const [imageFileList, setImageFileList] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [maxParticipants, setMaxParticipants] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    const categoryOptions = [
        { id: 1, name: '여행' },
        { id: 2, name: '음식' },
        { id: 3, name: '문화/공연/축제' },
        { id: 4, name: '업종/직무' },
        { id: 5, name: '음악' },
        { id: 6, name: '댄스/무용' },
        { id: 7, name: '사교' },
        { id: 8, name: '독서' },
        { id: 9, name: '운동' },
        { id: 10, name: 'e스포츠' },
        { id: 11, name: '외국어' },
        { id: 12, name: '스터디' },
        { id: 13, name: '공예' },
        { id: 14, name: '봉사' },
        { id: 15, name: '차/오토바이' }
    ];

    const locationOptions = [
        { code: 1, name: '서울' },
        { code: 2, name: '인천' },
        { code: 3, name: '대전' },
        { code: 4, name: '대구' },
        { code: 5, name: '광주' },
        { code: 6, name: '부산' },
        { code: 7, name: '울산' },
        { code: 8, name: '세종' },
        { code: 31, name: '경기' },
        { code: 32, name: '강원' },
        { code: 33, name: '충북' },
        { code: 34, name: '충남' },
        { code: 35, name: '경북' },
        { code: 36, name: '경남' },
        { code: 37, name: '전북' },
        { code: 38, name: '전남' },
        { code: 39, name: '제주' }
    ];

    useEffect(() => {
        if (!meetingId) return;
        const fetchMeeting = async () => {
            try {
                const response = await GetMeetingRequest(meetingId);
                if (!response) return;
                const { title, introduction, content, userDto, imageList, maxParticipants, tags, categories, locations } = response.meeting;
                if (response.code === 'SU') {
                    setTitle(title);
                    setIntroduction(introduction);
                    setContent(content);
                    setNickname(userDto.nickname);
                    const imageUrls = imageList.map((image: Images) => image.image);
                    setImagePreviews(imageUrls);
                    setMaxParticipants(maxParticipants);
                    setTags(tags);
                    setCategories(categories);
                    setLocations(locations);
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

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
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
        const requestBody = { title, introduction, content, nickname, imageList, maxParticipants, tags, categories, locations };
        if (!requestBody.categories.length) {
            alert('카테고리를 선택해주세요.');
            return;
        }
        if (!requestBody.locations.length) {
            alert('지역을 선택해주세요.');
            return;
        }
        const response = await PatchMeetingRequest(meetingId, requestBody, cookies.accessToken);
        if (!response) return;
        if (response.code === 'SU') {
            alert('성공적으로 수정되었습니다.');
            navigate(`/meeting/detail/${meetingId}`);
        } else {
            alert('수정에 실패했습니다.');
            return;
        }
    }

    const handleTagSelect = (categoryName: string) => {
        setCategories((prevCategories) =>
            prevCategories.includes(categoryName) ? prevCategories.filter((name) => name !== categoryName) : [...prevCategories, categoryName]
        );
    };

    const handleAreaSelect = (locationName: string) => {
        setLocations((prevLocations) =>
            prevLocations.includes(locationName) ? prevLocations.filter((name) => name !== locationName) : [...prevLocations, locationName]
        );
    };

    const isSelectedTag = (categoryName: string) => {
        return categories.includes(categoryName);
    };

    const isSelectedArea = (locationName: string) => {
        return locations.includes(locationName);
    };

    const handleTagClass = (tagName: string) => {
        return `category-option ${isSelectedTag(tagName) ? 'selected' : ''}`;
    };

    const handleAreaClass = (areaName: string) => {
        return `category-option ${isSelectedArea(areaName) ? 'selected' : ''}`;
    };

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
                <p><strong>카테고리</strong></p>
                <div className='category-select'>
                    {categoryOptions.map((category) => (
                        <div
                            key={category.id}
                            className={handleTagClass(category.name)}
                            onClick={() => handleTagSelect(category.name)}
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
                <br />
                <p><strong>지역</strong></p>
                <div className='category-select'>
                    {locationOptions.map((location) => (
                        <div
                            key={location.code}
                            className={handleAreaClass(location.name)}
                            onClick={() => handleAreaSelect(location.name)}
                        >
                            {location.name}
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
                <button onClick={updateButtonHandler}>수정</button>
            </div>
        </div>
    )
}
