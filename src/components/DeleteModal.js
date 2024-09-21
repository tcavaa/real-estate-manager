import React from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import styles from "./DeleteModal.module.css";

Modal.setAppElement("#root"); // This is important for accessibility

const DeleteModal = ({ isOpen, onRequestClose, onConfirm, id }) => {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      console.log(id);
      await API.deleteListing(id); // Replace with actual delete API call
      onConfirm(); // Notify parent to handle redirect or other actions
      navigate("/"); // Redirect to the home page after deletion
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Deletion"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <p className={styles.modalP}>გსურთ წაშალოთ ლისტინგი?</p>
      <div className={styles.modalDiv}>
        <button className={styles.modalcancel} onClick={onRequestClose}>გაუქმება</button>
        <button className={styles.modalok} onClick={handleConfirm}>დადასტურება</button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
