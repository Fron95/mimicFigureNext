import React, { useState } from "react";
import styles from "./ChatBubble.module.css";

interface ChatBubbleProps {
  is1P: boolean;
  message: string;
  time: string;
  onTogglePlayer: () => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  is1P,
  message,
  time,
  onTogglePlayer,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedMessage(e.target.value);
  };

  const handleEditSubmit = () => {
    onEdit(editedMessage);
    setIsEditing(false);
  };

  return (
    <div
      className={`${styles.chatBubbleWrapper} ${
        is1P ? styles.chatBubble1PWrapper : styles.chatBubble2PWrapper
      }`}
    >
      {!is1P && <span className={styles.time}>{time}</span>}
      <div
        className={`${styles.chatBubble} ${
          is1P ? styles.chatBubble1P : styles.chatBubble2P
        }`}
      >
        {isEditing ? (
          <div className={styles.editContainer}>
            <textarea
              className={styles.editTextarea}
              value={editedMessage}
              onChange={handleEditChange}
            />
            <button className={styles.saveButton} onClick={handleEditSubmit}>
              Save
            </button>
          </div>
        ) : (
          <>
            {message}
            <div className={styles.iconContainer}>
              <span className={styles.icon} onClick={onTogglePlayer}>
                ↔
              </span>
              <span className={styles.icon} onClick={onDelete}>
                ❌
              </span>
              <span className={styles.icon} onClick={() => setIsEditing(true)}>
                🖊️
              </span>
            </div>
          </>
        )}
      </div>
      {is1P && <span className={styles.time}>{time}</span>}
    </div>
  );
};

export default ChatBubble;
