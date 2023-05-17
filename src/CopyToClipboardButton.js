import React from 'react';
import './CopyToClipboardButton.css';

const CopyToClipboardButton = ({ textToCopy, buttonText, handleCopy }) => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => handleCopy())
      .catch(err => console.error("複製失敗：", err));
  }

  const buttonClass = buttonText === "複製" ? "copy" : "copy-success";

  return (
    <button className={buttonClass} onClick={copyToClipboard}>{buttonText}</button>
  );
}

export default CopyToClipboardButton;
