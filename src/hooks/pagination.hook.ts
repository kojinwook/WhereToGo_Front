import { useEffect, useState } from "react";

const usePagination = <T>(countPerPage: number) => {
  const [totalList, setTotalList] = useState<T[]>([]);
  const [viewList, setViewList] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPageList, setTotalPageList] = useState<number[]>([1]);

  const setView = () => {
    const FIRST_INDEX = countPerPage * (currentPage - 1);
    const LAST_INDEX = totalList.length > countPerPage * currentPage ? countPerPage * currentPage : totalList.length;
    const viewList = totalList.slice(FIRST_INDEX, LAST_INDEX);
    setViewList(viewList);
  };

  useEffect(() => {
    const totalPage = Math.ceil(totalList.length / countPerPage);
    const totalPageList = [];
    for (let page = 1; page <= totalPage; page++) totalPageList.push(page);
    setTotalPageList(totalPageList);
  }, [totalList, countPerPage]);

  useEffect(() => {
    setView();
  }, [currentPage, totalList, countPerPage]);

  return {
    currentPage,
    setCurrentPage,
    viewList,
    totalPageList,
    setTotalList
  };
};

export default usePagination;
