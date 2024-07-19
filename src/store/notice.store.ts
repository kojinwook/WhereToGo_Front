import {create} from "zustand";



interface NoticeStore{
    title : string;
    content : string;
    image : string;
    nickname : string;
    setTitle : (title: string) => void;
    setContent : (content : string) => void;
    setImage : (image :string) => void;
    setNickname : (nickname : string) => void;
    resetBoard : () => void;
}


const useNoticeStore = create<NoticeStore>(set => ({
    title : '',
    content : '',
    image : '',
    nickname : '',
    setTitle : (title) => set(state => ({...state,title})),
    setContent : (content) => set(state => ({...state,content})),
    setImage : (image) => set(state => ({...state,image})),
    setNickname : (nickname) => set(state => ({...state,nickname})),
    resetBoard : () => set(state => ({...state,title : '',content : '',image :''
        }))

}))

export default useNoticeStore;




