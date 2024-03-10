"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "@/components/chatMessage";
import React, { useState, useEffect } from "react";
import { Console } from "console";
import { stringify } from "querystring";
import { buffer } from "stream/consumers";

// config : bufferWindow
const bufferWindow = 2;

// config : format
function getBuffer(figure: string, index: number, bufferWindow: number) {
  const format = {
    figure: figure, // figure의 값을 할당해야 함
    question: "", // question 값이 정의되어 있지 않아서 추가
    summary: "", // summary가 있다면 string 값을 가짐
    buffer: {} as { [key: string]: [string, string] }, // buffer가 있다면 key: string, value: [string, string] 형태의 값
  };

  const summary = sessionStorage.getItem(`${figure}_summary`);
  if (summary) {
    format.summary = summary;
  }
  const lower = index - bufferWindow < 1 ? 1 : index - bufferWindow + 1;
  const iter = index - lower + 1;

  for (let i = 1; i < iter + 1; i++) {
    format.buffer[i.toString()] = ["", ""];
  }

  for (let i = 0; i < iter; i++) {
    // 배열의 인덱스를 0부터 시작하도록 변경
    var idx = i + 1;
    format.buffer[idx.toString()] = [
      sessionStorage.getItem(`${format.figure}${lower + i}`) || "",
      sessionStorage.getItem(`${format.figure}_response${lower + i}`) || "",
    ];
  }
  return format;
}

export default function InputWithButton({
  setLoading,
  index,
  setIndex,
  figure,
  setInputValue,
  answer,
  setAnswer,
  msg,
  setSummary,
}: {
  setLoading: Function;
  index: number;
  setIndex: Function;
  figure: string;
  setInputValue: Function;
  answer: string;
  setAnswer: Function;
  msg: string;
  setSummary: Function;
}) {
  // 이벤트리스너1 : 버튼 클릭시
  const handleButtonClick = async () => {
    if (msg === "") return alert("Please Enter a Message");
    if (msg.length > 1000)
      return alert(
        "Your Message is too long. Please keep it under 1000 characters."
      );
    const transferData = getBuffer(figure, index, bufferWindow);
    transferData.figure = figure;
    transferData.question = msg;

    var response = await getAnswer(transferData);
    // const response = "대답이다.";
    console.log("response : ", response);
    if (!response) {
      response = {
        quote: "I'm sorry. ERROR occured.",
        summary: transferData.summary,
      };
    }
    setAnswer(response.quote);
    setSummary(response.summary);
    sessionStorage.setItem(`${figure}`, `${index + 1}`);
    sessionStorage.setItem(`${figure}${index + 1}`, msg);
    sessionStorage.setItem(`${figure}_response${index + 1}`, response.quote);
    sessionStorage.setItem(`${figure}_summary`, response.summary);
    setInputValue("");
    setIndex(index + 1);
  };

  // 이벤트리스너 2 : 페칭
  async function getAnswer(transferData: any) {
    // get before chat
    console.log("transferData💔💔", transferData);
    const url = "/sibal";
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ ...transferData }),
      });
      const json = await response.json();
      const data = json.data;
      return data;
    } catch (error) {
      console.log("error : ", error);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "block",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          left: "0",
          right: "0",
          position: "absolute",
          bottom: "-40px",
          justifyContent: "center",
        }}
        className="flex w-full max-w-sm items-center space-x-2"
      >
        <div>
          <Textarea
            // variant="secondary"
            // type="text"
            placeholder={`Message to ${figure} `}
            value={msg}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p
            style={{ whiteSpace: "nowrap" }}
            className="text-sm text-muted-foreground"
          >
            Bot can make mistakes. Please check for important information.{" "}
          </p>
        </div>
        <Button onClick={handleButtonClick}>Send</Button>
      </div>
    </div>
  );
}
