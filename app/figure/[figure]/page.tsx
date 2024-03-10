"use client";

// style
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import styles from "@/styles/figure.module.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import Textarea from "@/components/textarea";
import Input from "@/components/chatInput";
import ChatMessage from "@/components/chatMessage";
import React, { useState, useEffect, useRef } from "react";
import type { Metadata } from "next";
// export const metadata: Metadata = {
// title: "Figure | Talk with your Figure",
// };

async function getData() {
  try {
    const datas = await fetch("/getdata");
    const data = await datas.json();
    return data;
  } catch {
    console.log("error");
  }
}

export default function Home({ params }: { params: { figure: string } }) {
  // 인물 이름
  const regex = /%20/g; // 정규 표현식, 'g'는 전역 검색을 의미함
  const figure = params.figure.replace(regex, "").toLowerCase(); // figure의 이름을 소문자로 변경

  // 스테이트 생성
  const [inputValue, setInputValue] = useState("");
  const [answer, setAnswer] = useState("");
  const storedIndex =
    typeof sessionStorage.getItem(`${figure}`) === "string"
      ? Number(sessionStorage.getItem(`${figure}`))
      : 0;
  const [index, setIndex] = useState(storedIndex);
  const [isLoading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDscription] = useState("");
  const [image, setImage] = useState("");
  const [summary, setSummary] = useState("");

  // useEffect(1)  인물정보 조회
  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      setName(data.datas[`${figure}`].name);
      setImage(data.datas[`${figure}`].image);
      setDscription(data.datas[`${figure}`].description);
    }
    fetchData();
  }, []);

  // useEffect(2) index가 변경될 때마다 스크롤을 가장 하단으로 이동
  return (
    <div className={styles.ship}>
      <div className={styles.container}>
        <div className={styles.figure_info_container}>
          <div className={styles.image_container}>
            <img
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              src={image}
              alt="figure"
            ></img>
          </div>

          <div className={styles.figure_detail_container}>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {name}
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {description}
            </p>
            <div className={styles.button_container}>
              <Link
                href={"/"}
                className={buttonVariants({ variant: "default" })}
              >
                Detail Story
              </Link>
              <Link
                href={"/"}
                className={buttonVariants({ variant: "secondary" })}
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
        <ScrollArea
          className="w-[700px] rounded-md border p-4"
          style={{ height: "calc(100% - 320px)" }}
        >
          <div>
            {index > 0 &&
              [...Array(index)].map((_, idx) => {
                const userMsg = sessionStorage.getItem(`${figure}${idx + 1}`);
                const figureMsg = sessionStorage.getItem(
                  `${figure}_response${idx + 1}`
                );
                return (
                  <div key={idx}>
                    {userMsg && (
                      <ChatMessage
                        setInputValue={setInputValue}
                        msg={userMsg}
                        talker={"User"}
                      />
                    )}
                    {figureMsg && (
                      <ChatMessage
                        setInputValue={setInputValue}
                        msg={figureMsg}
                        talker={"Figure"}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          {isLoading && <div className={styles.loading}>Loading...</div>}
        </ScrollArea>
      </div>
      <Input
        setLoading={setLoading}
        index={index}
        setIndex={setIndex}
        figure={figure}
        setInputValue={setInputValue}
        msg={inputValue}
        answer={answer}
        setAnswer={setAnswer}
        setSummary={setSummary}
      />
    </div>
  );
}
