// style
import styles from "@/styles/figure.module.css";

import React from "react";
import Avatar from "@/components/avatar";
export default function ChatMessage({
  msg,
  talker,
  setInputValue,
}: {
  msg: string;
  talker: string;
  setInputValue: Function;
}) {
  if (talker === "User") {
    return (
      <div className={styles.chat_container}>
        <div className={styles.chatter_info}>
          <Avatar
            image={
              "https://w7.pngwing.com/pngs/81/570/png-transparent-profile-logo-computer-icons-user-user-blue-heroes-logo-thumbnail.png"
            }
          />
          <div className={styles.name}>User</div>
        </div>
        <div>
          <p className=" leading-7 [&:not(:first-child)]:mt-6">{msg}</p>
        </div>
      </div>
    );
  }
  if (talker === "Figure") {
    return (
      <div className={styles.chat_container}>
        <div className={styles.chatter_info_figure}>
          <div className={styles.name}>"Steve Jobs"</div>
          <Avatar
            image={
              "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcSX3ZOe1nBi0kfUtkLB7NcH2Qm64eR8eoZ-0TUppPNN4PfjcGAyW-eemOs2JKdRYH6R"
            }
          />
        </div>
        <div>
          <p
            style={{ textAlign: "right" }}
            className=" leading-7 [&:not(:first-child)]:mt-6"
          >
            {msg}
          </p>
        </div>
      </div>
    );
  }
}
