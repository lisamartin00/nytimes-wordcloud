import styles from '../styles/Modal.module.css';

function Modal({
  isOpen, closeModal, title, children,
}) {
  return (
    <>
      {isOpen && (
      <>
        <div className={styles.modalOverlay} onClick={closeModal} />
        <div className={styles.modal}>
          <div className={styles.closeModalButton} role="button" aria-pressed="false" onClick={closeModal}>&times;</div>
          <h2>{title}</h2>
          {children}
        </div>
      </>
      )}
    </>
  );
}

export default Modal;
