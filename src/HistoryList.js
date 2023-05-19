import React, { useState, useEffect } from "react";
import "./HistoryList.css";
import { NavLink } from "react-router-dom";
import CopyToClipboardButton from "./CopyToClipboardButton";
import useFetch from "./useFetch";

const HistoryList = ({ apiURL }) => {
  const [buttonStates, setButtonStates] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 4;


  const {
    data: fetchHistories,
    isPending,
    error,
  } = useFetch(`${apiURL}/generated_histories`);
  

  const handleCopy = (index) => {
    setButtonStates(
      buttonStates.map((state, i) => (i === index ? "複製成功" : "複製"))
    );
  };

  useEffect(() => {
    setPageIndex(0);
  }, [selectedKeyword]);

  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const clearSelectedKeyword = () => {
    setSelectedKeyword(null);
  };

  const prepareKeywords = (keywords) => {
    let values = Object.values(keywords);
    let keywordsArray = values.map((val) =>
      Array.isArray(val) ? val : val.split(",")
    );
    let flattenedKeywords = keywordsArray.flat();
    let uniqueKeywords = [...new Set(flattenedKeywords)];
    return uniqueKeywords.filter((keyword) => keyword.trim() !== "");
  };

  const filteredHistories = fetchHistories && fetchHistories
    .filter((history) =>
      selectedKeyword
        ? prepareKeywords(history.keywords).includes(selectedKeyword)
        : true
    )
    .filter((history) =>
      selectedType ? history.history_type === selectedType : true
    )
    .reverse();

  const paginatedHistories = filteredHistories && filteredHistories.slice(
    pageIndex * itemsPerPage,
    (pageIndex + 1) * itemsPerPage
  );

  useEffect(() => {
    setButtonStates(new Array(paginatedHistories && paginatedHistories.length).fill("複製"));
  }, [paginatedHistories]);  

  console.log("selectedKeyword: ", selectedKeyword);

  return (
    <div>
      <div className="menu-container">
        <select
          onChange={handleTypeChange}
          value={selectedType}
          className="select-menu"
        >
          <option value="">所有類型</option>
          <option value="自我介紹">自我介紹</option>
          <option value="面試問題">面試問題</option>
        </select>
        {selectedKeyword && (
          <p className="keyword-selector">
            按關鍵字查看生成歷史：<strong>{selectedKeyword}</strong>
            <button
              onClick={clearSelectedKeyword}
              className="clear-keyword-button"
            >
              清除選擇的關鍵字
            </button>
          </p>
        )}
      </div>

      <div className="history-list">
        {paginatedHistories && paginatedHistories.map((history, index) => (
          <div key={index} className="history-item">
            <div className="history-item-header">
              <NavLink to={`/history/${history.id}`}>
                <h2>{history.history_type}</h2>
              </NavLink>
              <CopyToClipboardButton
                textToCopy={history.content}
                buttonText={buttonStates[index]}
                handleCopy={() => handleCopy(index)}
              />
            </div>
            <p>{history.content}</p>
            <p className="history-keywords">
              關鍵字：
              {prepareKeywords(history.keywords).map((keyword, index) => (
                <span
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className="keyword"
                >
                  {keyword},&nbsp;
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>

      {isPending && <div className="is-pending">讀取中...</div>}
      {error && <div className="error">{error}</div>}

      <div className="paginate">
        <button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          上一頁
        </button>
        <p>
          第 {pageIndex + 1} / {Math.ceil(filteredHistories && (filteredHistories.length / itemsPerPage))} 頁
        </p>
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={
            pageIndex === Math.ceil(filteredHistories && (filteredHistories.length / itemsPerPage)) - 1
          }
        >
          下一頁
        </button>
      </div>
    </div>
  );
};

export default HistoryList;
