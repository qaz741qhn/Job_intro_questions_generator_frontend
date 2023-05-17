import React, { useState, useEffect } from "react";
import "./HistoryList.css";
import CopyToClipboardButton from "./CopyToClipboardButton";

const HistoryList = ({ apiURL }) => {
  const [histories, setHistories] = useState([]);
  const [buttonStates, setButtonStates] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null); 

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = () => {
    fetch(`${apiURL}/generated_histories`)
      .then((response) => response.json())
      .then((data) => {
        setHistories(data);
        setButtonStates(new Array(data.length).fill("複製"));
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleCopy = (index) => {
    setButtonStates(buttonStates.map((state, i) => i === index ? "複製成功" : "複製"));
  };

  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
  };

  const clearSelectedKeyword = () => {
    setSelectedKeyword(null);
  };

  const prepareKeywords = (keywords) => {
    let values = Object.values(keywords);
    let keywordsArray = values.map(val => Array.isArray(val) ? val : val.split(','));
    let flattenedKeywords = keywordsArray.flat();
    let uniqueKeywords = [...new Set(flattenedKeywords)];
    return uniqueKeywords.filter(keyword => keyword.trim() !== '');
  }

  const filteredHistories = selectedKeyword
    ? histories.filter(history =>
        prepareKeywords(history.keywords).includes(selectedKeyword)
      )
    : histories;

  return (
    <div className="history-list">
      {selectedKeyword && (
        <p>
          按關鍵字查看生成歷史：<strong>{selectedKeyword}</strong>
          <button onClick={clearSelectedKeyword}>清除選擇的關鍵字</button>
        </p>
      )}

      {filteredHistories.map((history, index) => (
        <div key={index} className="history-item">
          <div className="history-item-header">
            <h2>{history.history_type}</h2>
            <CopyToClipboardButton textToCopy={history.content} buttonText={buttonStates[index]} handleCopy={() => handleCopy(index)} />
          </div>
          <p>{history.content}</p>
          <p className="history-keywords">
            關鍵字：{prepareKeywords(history.keywords).map((keyword, index) => (
              <span key={index} onClick={() => handleKeywordClick(keyword)} className="keyword">
                {keyword},&nbsp;
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
