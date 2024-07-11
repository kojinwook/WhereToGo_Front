import {create} from "zustand";



interface NoticeStore{
    title : string;
    content : string;
    image : string;
    setTitle : (title: string) => void;
    setContent : (content : string) => void;
    setImage : (image :string) => void;
    resetBoard : () => void;
}


const useNoticeStore = create<NoticeStore>(set => ({
    title : '',
    content : '',
    image : '',
    setTitle : (title) => set(state => ({...state,title})),
    setContent : (content) => set(state => ({...state,content})),
    setImage : (image) => set(state => ({...state,image})),
    resetBoard : () => set(state => ({...state,title : '',content : '',image :''
        }))

}))

export default useNoticeStore;




