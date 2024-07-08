import { create } from 'zustand';

interface Festival {
    title: string;
    startDate: string;
    endDate: string;
    address1: string;
    firstImage: string;
    tel: string;
    mapX: string;
    mapY: string;
    modifyDate: string;
    areaCode: string;
    sigunguCode: string;
    contentId: string;
    contentTypeId: string;
    homepage: string;
    rates: number;
    tags: string[];
}

interface FestivalStore {
    formData: Festival;
    setFormData: (data: Partial<Festival>) => void;
    resetFormData: () => void;
}

const useFestivalStore = create<FestivalStore>((set) => ({
    formData: {
        title: '',
        startDate: '',
        endDate: '',
        address1: '',
        firstImage: '',
        tel: '',
        mapX: '',
        mapY: '',
        modifyDate: '',
        areaCode: '',
        sigunguCode: '',
        contentId: '',
        contentTypeId: '',
        homepage: '',
        rates: 0,
        tags: [],
    },
    setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data },
    })),
    resetFormData: () => set(() => ({
        formData: {
            title: '',
            startDate: '',
            endDate: '',
            address1: '',
            firstImage: '',
            tel: '',
            mapX: '',
            mapY: '',
            modifyDate: '',
            areaCode: '',
            sigunguCode: '',
            contentId: '',
            contentTypeId: '',
            homepage: '',
            rates: 0,
            tags: [],
        },
    })),
}));

export default useFestivalStore;
