// style
import styles from "@/styles/figure.module.css";

import React from "react";
import Avatar from "@/components/avatar";
export default function ChatMessage({
  msg,
  talker,
  name,
  image,
}: {
  msg: string;
  talker: string;
  name: string;
  image: string;
}) {
  if (talker === "User") {
    return (
      <div className={styles.chat_container}>
        <div className={styles.chatter_info}>
          <Avatar
            image={  image    }
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
          <div className={styles.name}>{name}</div>
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
