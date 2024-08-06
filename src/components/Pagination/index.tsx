import React, { Dispatch, SetStateAction } from "react";
import "./style.css";

interface Props {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  viewPageList: number[];
}

const Pagination: React.FC<Props> = ({ currentPage, setCurrentPage, viewPageList }) => {
  const onPageClickHandler = (page: number) => {
    setCurrentPage(page);
  };

  const onPreviousClickHandler = () => {
    const prevPage = currentPage - 1;
    if (prevPage < 1) return;
    setCurrentPage(prevPage);
  };

  const onNextClickHandler = () => {
    const nextPage = currentPage + 1;
    if (nextPage > viewPageList[viewPageList.length - 1]) return;
    setCurrentPage(nextPage);
  };

  const pageSize = 5;
  const totalPages = viewPageList.length;
  
  // Calculate start and end page numbers
  const startPage = Math.max(1, Math.min(currentPage - Math.floor(pageSize / 2), totalPages - pageSize + 1));
  const endPage = Math.min(startPage + pageSize - 1, totalPages);

  const limitedViewPageList = viewPageList.slice(startPage - 1, endPage);

  return (
    <div id="pagination-wrapper">
      <div className="pagination-change-link-box">
        <div
          className="icon-box-small"
          style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
        >
          <div
            className="pagination-change-link-text"
            onClick={onPreviousClickHandler}
          >
            {"이전"}
          </div>
        </div>
        <div className="pagination-divider">{"|"}</div>
        {limitedViewPageList.map((page) =>
          page === currentPage ? (
            <div className="pagination-text-active" key={page}>
              {page}
            </div>
          ) : (
            <div
              className="pagination-text"
              key={page}
              onClick={() => onPageClickHandler(page)}
            >
              {page}
            </div>
          )
        )}
        <div className="pagination-divider">{"|"}</div>
        <div className="pagination-change-link-box">
          <div
            className="pagination-change-link-text"
            onClick={onNextClickHandler}
            style={{ cursor: currentPage === viewPageList[viewPageList.length - 1] ? "not-allowed" : "pointer" }}
          >
            {"다음"}
          </div>
          <div className="icon-box-small"></div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
