import { create } from "zustand";

interface AnswerStore{
    title: string;
    content: string;
    userId: string;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setUserId: (userId: string) => void;
    resetBoard : ()=> void;
};

const useAnswerStore = create<AnswerStore>((set: (arg0: { (state: any): any; (state: any): any; (state: any): any; (state: any): any; }) => any) => ({
    title:'',
    content:'',
    userId:'',
    setTitle:(title: any) => set((state: any) => ({...state,title})),
    setContent:(content: any) => set((state: any) => ({...state,content})),
    setUserId:(userId: any) => set((state: any) => ({...state,userId})),
    resetBoard:()=> set((state: any) => ({...state,title:'',content:'',userId:''}))
}))

export default useAnswerStore;