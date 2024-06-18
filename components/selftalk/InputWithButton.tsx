import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import styles from "@/components/selftalk/InputWithButton.module.css";
import SwitchDemo from "@/components/selftalk/SwitchDemo";
import { ChangeEvent, RefObject } from "react";
interface InputWithButtonProps {
  player: string;
  setPlayer: (player: string) => void;
  setMessage: (message: string) => void;
  message: string;
  onSend: () => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

export default function InputWithButton({
  player,
  setPlayer,
  setMessage,
  message,
  onSend,
  textareaRef,
}: InputWithButtonProps) {
  const togglePlayer = () => {
    setPlayer(player === "1p" ? "2p" : "1p");
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="container flex w-full items-center space-x-2">
      <SwitchDemo onToggle={togglePlayer} />
      <Textarea
        placeholder="Message"
        className={`flex-grow ${styles.textarea}`}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={textareaRef}
      />
      <Button type="button" onClick={onSend}>
        SEND
      </Button>
      {/* <Button type="button">이미지</Button> */}
    </div>
  );
}
