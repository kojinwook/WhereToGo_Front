import { create } from "zustand";

interface QuestionStore {
    title : string;
    content : string;
    userId : string;
    type : string;
    image : string;
    setTitle : (title : string) => void;
    setContent : (content : string) => void;
    setUserId : (userId : string) => void;
    setType : (type : string) => void;
    setImage : (image : string) => void;
    resetBoard : () => void;
}

const useQuestionStore = create<QuestionStore>(set => ({
    title : '',
    content:'',
    userId: '',
    type: '',
    image: '',
    setTitle: (title) => set(state => ({...state,title})),
    setContent : (content) => set(state => ({...state,content})),
    setUserId : (userId) => set(state => ({...state,userId})),
    setType: (type) => set(state => ({...state,type})),
    setImage: (image) => set(state => ({...state,image})),
    resetBoard : () => set(state => ({...state,title:'',content:'',userId:'',type:'',image:''
    }))
}));

export default useQuestionStore;

