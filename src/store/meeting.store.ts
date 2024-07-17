import { Images } from "types/interface/interface";
import { create } from "zustand";

interface Meeting {
    meetingId: number;
    title: string;
    introduction: string;
    content: string;
    nickname: string;
    imageList: Images[];
    maxParticipants: number;
    tags: string[];
    areas: string[];
}

interface MeetingStore {
    formData: Meeting;
    setFormData: (data: Partial<Meeting>) => void;
    resetFormData: () => void;
}

const useMeetingStore = create<MeetingStore>((set) => ({
    formData: {
        meetingId: 0,
        title: '',
        introduction: '',
        content: '',
        nickname: '',
        imageList: [],
        maxParticipants: 0,
        tags: [],
        areas: [],
    },
    setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data },
    })),
    resetFormData: () => set(() => ({
        formData: {
            meetingId: 0,
            title: '',
            introduction: '',
            content: '',
            nickname: '',
            imageList: [],
            maxParticipants: 0,
            tags: [],
            areas: [],
        }
    })),
}))

export default useMeetingStore

