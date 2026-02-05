import { useEffect, useRef } from "react";
import "./InfoModal.css";

const CLOSE_ARIA = "Закрити";

function InfoModal({ title, body, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="info-modal" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
      <div className="info-modal__overlay" role="presentation" onClick={onClose} />
      <div className="info-modal__card" role="document">
        <header className="info-modal__header">
          <h2 id="info-modal-title">{title}</h2>
          <button
            type="button"
            className="info-modal__close"
            onClick={onClose}
            aria-label={CLOSE_ARIA}
            ref={closeButtonRef}
          >
            ×
          </button>
        </header>
        <div className="info-modal__body">{body}</div>
      </div>
    </div>
  );
}

export default InfoModal;
