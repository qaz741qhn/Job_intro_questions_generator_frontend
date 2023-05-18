import "./Module.css";

const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>關閉</button>
      </div>
    </div>
  );
};

export default Modal;
