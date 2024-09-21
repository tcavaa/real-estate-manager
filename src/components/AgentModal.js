import React, { useState } from "react";
import API from "../api/api";
import styles from "./AgentModal.module.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

function AgentModal({ isOpen, onRequestClose, onConfirm }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isNameValid, setIsNameValid] = useState();
  const [isSurnameValid, setIsSurnameValid] = useState();
  const [isEmailValid, setIsEmailValid] = useState();
  const [isPhoneValid, setIsPhoneValid] = useState();
  const [isAvatarValid, setIsAvatarValid] = useState();

  const validateFields = () => {
    let error = "";

    if (name.length < 2) {
      setIsNameValid(false);
      error = "Name must be at least 2 characters long.";
    } else {
      setIsNameValid(true);
    }

    if (surname.length < 2) {
      setIsSurnameValid(false);
      error = "Surname must be at least 2 characters long.";
    } else {
      setIsSurnameValid(true);
    }

    if (!email.endsWith("@redberry.ge")) {
      setIsEmailValid(false);
      error = "Email must end with @redberry.ge.";
    } else {
      setIsEmailValid(true);
    }

    if (!avatar) {
      setIsAvatarValid(false);
      error = "Avatar is required.";
    } else {
      setIsAvatarValid(true);
    }

    if (!/^[5]\d{8}$/.test(phone)) {
      setIsPhoneValid(false);
      error = "Phone number must be in the format 5XXXXXXXXX.";
    } else {
      setIsPhoneValid(true);
    }

    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateFields();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage("");

    try {
      // Call the API to add the agent
      const response = await API.addAgents({
        name,
        surname,
        email,
        phone,
        avatar,
      });

      // Close the modal and reset fields
      onConfirm();
      setName("");
      setSurname("");
      setEmail("");
      setAvatar(null);
      setPhone("");
      setIsNameValid();
      setIsSurnameValid();
      setIsEmailValid();
      setIsPhoneValid();
      setIsAvatarValid();
    } catch (error) {
      setErrorMessage("Failed to add agent. Please try again.");
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    setAvatar(e.target.files[0]);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Deletion"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div>
        <div className={styles.agentModalContent}>
          <h2>აგენტის დამატება</h2>
          <form className={styles.agentAddForm} onSubmit={handleSubmit}>
            <div className={styles.formFlex}>
              <div className={styles.formGroups}>
                <label className={styles.formlabels}>სახელი *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`${
                    isNameValid === undefined
                      ? ""
                      : isNameValid
                      ? styles.valid
                      : styles.invalid
                  }`}
                />
                <p
                  className={`${
                    isNameValid === undefined
                      ? ""
                      : isNameValid
                      ? styles.validp
                      : styles.invalidp
                  }`}
                >
                  ✔️ მინიმუმ ორი სიმბოლო
                </p>
              </div>
              <div className={styles.formGroups}>
                <label className={styles.formlabels}>გვარი</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                  className={`${
                    isSurnameValid === undefined
                      ? ""
                      : isSurnameValid
                      ? styles.valid
                      : styles.invalid
                  }`}
                />
                <p
                  className={`${
                    isSurnameValid === undefined
                      ? ""
                      : isSurnameValid
                      ? styles.validp
                      : styles.invalidp
                  }`}
                >
                  ✔️ მინიმუმ ორი სიმბოლო
                </p>
              </div>
            </div>
            <div className={styles.formFlex}>
              <div className={styles.formGroups}>
                <label className={styles.formlabels}>ელ-ფოსტა*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${
                    isEmailValid === undefined
                      ? ""
                      : isEmailValid
                      ? styles.valid
                      : styles.invalid
                  }`}
                />
                <p
                  className={`${
                    isEmailValid === undefined
                      ? ""
                      : isEmailValid
                      ? styles.validp
                      : styles.invalidp
                  }`}
                >
                  ✔️ გამოიყენეთ @Redberry.ge ფოსტა
                </p>
              </div>
              <div className={styles.formGroups}>
                <label className={styles.formlabels}>ტელეფონის ნომერი</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className={`${
                    isPhoneValid === undefined
                      ? ""
                      : isPhoneValid
                      ? styles.valid
                      : styles.invalid
                  }`}
                />
                <p
                  className={`${
                    isPhoneValid === undefined
                      ? ""
                      : isPhoneValid
                      ? styles.validp
                      : styles.invalidp
                  }`}
                >
                  ✔️ მხოლოდ რიცხვები
                </p>
              </div>
            </div>
            <div className={styles.fileUpload}>
              <label className={styles.formlabels}>ატვირთეთ ფოტო *</label>
              <input
                type="file"
                onChange={handleFileUpload}
                required
                className={`${
                  isAvatarValid === undefined
                    ? ""
                    : isAvatarValid
                    ? styles.valid
                    : styles.invalid
                }`}
              />
            </div>

            <div className={styles.buttonsAgent}>
              <button className={styles.modalcancel} onClick={onRequestClose}>
                გაუქმება
              </button>
              <button className={styles.modalok} onClick={handleSubmit}>
                დადასტურება
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default AgentModal;
