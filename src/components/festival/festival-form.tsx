// import React, { useState } from 'react'
// import { Festival } from 'types/interface/interface';

// interface FestivalEditFormProps {
//     festival: Festival;
//     onSave: (updatedFestival: Festival) => void;
//     onCancel: () => void;
// }

// const FestivalEditForm: React.FC<FestivalEditFormProps> = ({ festival, onSave, onCancel }) => {
//     const [formData, setFormData] = useState<Festival>({ ...festival });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({ ...prevData, [name]: value }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSave(formData);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="text" name="title" value={formData.title} onChange={handleChange} />
//             <input type="text" name="startDate" value={formData.startDate} onChange={handleChange} />
//             <input type="text" name="endDate" value={formData.endDate} onChange={handleChange} />
//             <input type="text" name="address1" value={formData.address1} onChange={handleChange} />
//             <input type="text" name="firstImage" value={formData.firstImage} onChange={handleChange} />
//             <input type="text" name="tel" value={formData.tel} onChange={handleChange} />
//             <input type="text" name="mapX" value={formData.mapX} onChange={handleChange} />
//             <input type="text" name="mapY" value={formData.mapY} onChange={handleChange} />
//             <input type="text" name="modifyDate" value={formData.modifyDate} onChange={handleChange} />
//             <input type="text" name="areaCode" value={formData.areaCode} onChange={handleChange} />
//             <input type="text" name="sigunguCode" value={formData.sigunguCode} onChange={handleChange} />
//             <input type="text" name="contentId" value={formData.contentId} onChange={handleChange} />
//             <input type="text" name="contentTypeId" value={formData.contentTypeId} onChange={handleChange} />
//             <input type="text" name="homepage" value={formData.homepage} onChange={handleChange} />
//             <button type="submit">Save</button>
//             <button type="button" onClick={onCancel}>Cancel</button>
//         </form>
//     );
// };

// export default FestivalEditForm;
import React from 'react'

export default function Ff() {
    return (
        <div>Ff</div>
    )
}

