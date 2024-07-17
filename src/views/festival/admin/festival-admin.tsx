import React, { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { GetFestivalListRequest, PatchFestivalRequest } from 'apis/apis';
import { useCookies } from 'react-cookie';
import Festival from 'types/interface/festival.interface';
import './style.css';
import useFestivalStore from 'store/festival.store';

const FestivalAdmin: React.FC = () => {
    const [festivalList, setFestivalList] = useState<Festival[]>([]);
    const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [tags, setTags] = useState<string[]>([]);
    const { formData, setFormData, resetFormData } = useFestivalStore();
    const [cookies, setCookies] = useCookies();

    const formatDate = (dateStr: string) => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}년 ${month}월 ${day}일`;
    };

    useEffect(() => {
        const fetchFestivalList = async () => {
            try {
                const response = await GetFestivalListRequest();
                if(!response) return;
                if (response.code === 'SU') {
                    setFestivalList(response.festivalList);
                }
            } catch (error) {
                console.error('Error fetching festival list:', error);
            }
        };
        fetchFestivalList();
    }, []);

    const handleEdit = (festival: Festival) => {
        setEditingFestival(festival);
        setFormData(festival);
        if (typeof festival.tags === 'string') {
            setTags(festival.tags.split(','));
        } else {
            setTags(festival.tags || []);
        }
        setModalOpen(true);
    };

    const handleCancelEdit = () => {
        setEditingFestival(null);
        resetFormData();
        setTags([]);
        setModalOpen(false);
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (formData) {
            try {
                const updatedFormData = { ...formData, tags };
                console.log('updatedFormData:', updatedFormData);

                const response = await PatchFestivalRequest(updatedFormData, cookies.accessToken);
                if(!response) return;
                if (response.code === 'SU' && festivalList) {
                    setFestivalList(festivalList.map(festival =>
                        festival.contentId === updatedFormData.contentId ? updatedFormData : festival
                    ));
                    setEditingFestival(null);
                    resetFormData();
                    setTags([]);
                    setModalOpen(false);
                } else {
                    console.error('Failed to update festival:', response.message);
                }
            } catch (error) {
                console.error('Error updating festival:', error);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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

    if (!festivalList) return null;

    return (
        <div>
            {festivalList.map((festival, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <p><strong>Title:</strong> {festival.title}</p>
                        <p><strong>Address:</strong> {festival.address1}</p>
                        <p><strong>First Image:</strong> <img src={festival.firstImage} alt={festival.title} style={{ maxWidth: '200px' }} /></p>
                        <p><strong>Start Date:</strong> {formatDate(festival.startDate)}</p>
                        <p><strong>End Date:</strong> {formatDate(festival.endDate)}</p>
                        <p><strong>Telephone:</strong> {festival.tel}</p>
                        <p><strong>Content ID:</strong> {festival.contentId}</p>
                        <p><strong>Homepage:</strong> {festival.homepage ? <a href={festival.homepage}>{festival.homepage}</a> : 'N/A'}</p>
                        <p><strong>Tags:</strong> {Array.isArray(festival.tags) ? festival.tags.map(tag => `#${tag}`).join(' ') : `#${festival.tags}`}</p>
                        <div className='festival-admin-edit' onClick={() => handleEdit(festival)}>수정</div>
                    </div>
                </div>
            ))}
            {modalOpen && (
                <div className="festival-admin-modal-container">
                    <div className="festival-admin-modal-content">
                        <span className="festival-admin-modal-close" onClick={handleCancelEdit}>&times;</span>
                        <form className="festival-admin-modal-form" onSubmit={handleSave}>
                            <label>Title:</label>
                            <input type="text" name="title" value={formData?.title || ''} onChange={handleChange} />
                            <label>Address:</label>
                            <input type="text" name="address1" value={formData?.address1 || ''} onChange={handleChange} />
                            <label>First Image:</label>
                            <input type="text" name="firstImage" value={formData?.firstImage || ''} onChange={handleChange} />
                            <label>Start Date:</label>
                            <input type="text" name="startDate" value={formData?.startDate || ''} onChange={handleChange} />
                            <label>End Date:</label>
                            <input type="text" name="endDate" value={formData?.endDate || ''} onChange={handleChange} />
                            <label>Telephone:</label>
                            <input type="text" name="tel" value={formData?.tel || ''} onChange={handleChange} />
                            <label>Content ID:</label>
                            <input type="text" name="contentId" value={formData?.contentId || ''} onChange={handleChange} />
                            <label>Homepage:</label>
                            <input type="text" name="homepage" value={formData?.homepage || ''} onChange={handleChange} />
                            <label>Tags:</label>
                            <input type="text" name="tags" onKeyDown={handleTagKeyDown} />
                            <div className="tags-container">
                                {tags.map((tag, index) => (
                                    <div key={index} className="tag-item">
                                        #{tag}
                                        <span className="tag-remove" onClick={() => removeTag(tag)}>&times;</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <button type="submit">Save</button>
                                <button type="button" onClick={handleCancelEdit}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FestivalAdmin;
