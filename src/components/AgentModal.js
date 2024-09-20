import React, { useState } from "react";
import API from "../api/api";

function AgentModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateFields = () => {
    if (name.length < 2) return "Name must be at least 2 characters long.";
    if (surname.length < 2)
      return "Surname must be at least 2 characters long.";
    if (!email.endsWith("@redberry.ge"))
      return "Email must end with @redberry.ge.";
    if (!avatar) return "Avatar is required.";
    if (!/^[5]\d{8}$/.test(phone))
      return "Phone number must be in the format 5XXXXXXXXX.";
    return "";
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
      console.log("Agent added:", response);

      // Close the modal and reset fields
      onClose();
      setName("");
      setSurname("");
      setEmail("");
      setAvatar(null);
      setPhone("");
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
    <div className="modal">
      <div className="modal-content">
        <h2>Add Agent</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Surname */}
          <label>Surname:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />

          {/* Email */}
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Avatar */}
          <label>Avatar:</label>
          <input type="file" onChange={handleFileUpload} required />

          {/* Phone Number */}
          <label>Phone Number:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* Error Message */}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          {/* Buttons */}
          <button type="submit">Save Agent</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgentModal;
