import { create } from "zustand";
import useAnswerStore from "./answer.store";

interface ReviewStore {
    content: string;
    nickname: string;
    rate: number;
    setContent: (content: string) => void;
    setNickname: (nickname: string) => void;
    resetBoard: () => void;
};

const useReviewStore = create<ReviewStore>((set: (arg0: { (state: any): any; (state: any): any; (state: any): any; }) => any) => ({
    content: '',
    nickname: '',
    rate: 0,
    setContent: (content: any) => set((state: any) => ({ ...state, content })),
    setNickname: (nickname: any) => set((state: any) => ({ ...state, nickname })),
    setRate: (rate: any) => set((state: any) => ({ ...state, rate })),
    resetBoard: () => set((state: any) => ({ ...state, content: '', nickname: '', rate: 0}))
}))

export default useReviewStore
