"use client";

// style
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
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
      if (data.datas && data.datas[`${figure}`]) {
        console.log("data.datas", data.datas);
        setName(data.datas[`${figure}`].name);
        setImage(data.datas[`${figure}`].image);
        setDscription(data.datas[`${figure}`].description);
      }
    }
    fetchData();
  }, []);

  // useEffect(2) index가 변경될 때마다 스크롤을 가장 하단으로 이동
  if (!image) {
    return (
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          <br></br>
          Sorry..We are Not ready for "{figure}" yet.
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          "Please check the figures on the main page."
        </p>
        <Button asChild variant="destructive">
          <Link href="/">Back to Main</Link>
        </Button>
      </div>
    );
  } else {
    return (
      <div className={styles.ship}>
        <div className={styles.container}>
          <div className={styles.figure_info_container}>
            <div className={styles.image_container}>
              <img
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={image}
                alt={`picture of ${figure}`}
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
                          name={name}
                          msg={userMsg}
                          talker={"User"}
                          image={image}
                        />
                      )}
                      {figureMsg && (
                        <ChatMessage
                          name={name}
                          image={image}
                          msg={figureMsg}
                          talker={"Figure"}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
            <div className={styles.loading_container}>
              {isLoading && (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Preparing a Answer ( 10 ~ 15 sec..)
                </Button>
              )}
            </div>
          </ScrollArea>
        </div>
        <Input
          setLoading={setLoading}
          figure={figure}
          setIndex={setIndex}
          index={index}
          setInputValue={setInputValue}
          msg={inputValue}
          setAnswer={setAnswer}
          answer={answer}
          setSummary={setSummary}
        />
      </div>
    );
  }
}
