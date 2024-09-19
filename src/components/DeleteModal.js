import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

Modal.setAppElement('#root'); // This is important for accessibility

const DeleteModal = ({ isOpen, onRequestClose, onConfirm, id }) => {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
     console.log(id);
      await API.deleteListing(id); // Replace with actual delete API call
      onConfirm(); // Notify parent to handle redirect or other actions
      navigate('/'); // Redirect to the home page after deletion
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  return (
    
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Deletion"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this listing?</p>
      <button onClick={onRequestClose}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </Modal>
  );
};

export default DeleteModal;
