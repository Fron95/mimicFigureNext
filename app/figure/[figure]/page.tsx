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
  const scrollRef = useRef(null); // 스크롤 위치를 제어하기 위한 ref 생성
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
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current; // scrollRef가 참조하는 요소가 있으면, 해당 요소의 스크롤 위치를 조정
      scrollElement.scrollTop = scrollElement.scrollHeight; // 스크롤을 가장 하단으로 이동
    }
  }, [index]); // index가 변경될 때마다 이 useEffect가 실행되도록 의존성 배열에 추가
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
          ref={scrollRef} // ScrollArea에 ref 속성으로 scrollRef 연결
          className="w-[700px] rounded-md border p-4"
          style={{ height: "calc(100% - 320px)" }}
        >
          <div>
            {index > 0 &&
              [...Array(index)].map((_, idx) => (
                <div key={idx}>
                  <ChatMessage
                    setInputValue={setInputValue}
                    msg={sessionStorage.getItem(`${figure}${idx + 1}`)}
                    talker={"User"}
                  />
                  <ChatMessage
                    setInputValue={setInputValue}
                    msg={sessionStorage.getItem(`${figure}_response${idx + 1}`)}
                    talker={"Figure"}
                  />
                </div>
              ))}
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
