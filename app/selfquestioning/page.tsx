"use client";
import styles from "./page.module.css";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import TypographyH1 from "@/components/selftalk/TypographyH1";
import TypographyH2 from "@/components/selftalk/TypographyH2";
import TypographyP from "@/components/selftalk/TypographyP";

import left from "@/components/selftalk/left";

import { Button } from "@/components/ui/button";
import InputWithButton from "@/components/selftalk/InputWithButton";
import Layout from "@/components/selftalk/Layout";
import ChatBubble from "@/components/selftalk/chatbubble";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { relative } from "path";

interface Message {
  text: string;
  player: string;
  time: string;
}

interface Chat {
  title: string;
  description: string;
  lastMessageTime: string;
  messages: Message[];
}

export default function Home() {
  const ini_title = `1번째 자기대화`;
  const ini_description =
    "이번 대화를 설명해주세요. 지난 대화를 찾거나 중심을 잡는데 도움이 됩니다.";

  const [title, setTitle] = useState<string>(ini_title);
  const [description, setDescription] = useState<string>(ini_description);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [player, setPlayer] = useState<string>("1p");
  const [showNewMessagePopup, setShowNewMessagePopup] =
    useState<boolean>(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState<Chat[]>([
    {
      title: title,
      description: description,
      lastMessageTime: "",
      messages: [],
    },
  ]);

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(true);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim() !== "") {
      const now = new Date();
      const time = now.toISOString();
      const newMessages = [...messages, { text: message, player, time }];
      setMessages(newMessages);
      setMessage("");

      // 현재 대화 목록 업데이트
      const updatedChats = [...chats];
      updatedChats[currentChatIndex] = {
        ...updatedChats[currentChatIndex],
        lastMessageTime: time,
        messages: newMessages,
      };
      setChats(updatedChats);
    }
  };

  const togglePlayer = () => {
    setPlayer(player === "1p" ? "2p" : "1p");
  };

  const handleTogglePlayer = (index: number) => {
    const updatedMessages = messages.map((msg, i) =>
      i === index ? { ...msg, player: msg.player === "1p" ? "2p" : "1p" } : msg
    );
    setMessages(updatedMessages);
    updateChat(updatedMessages);
  };

  const handleDeleteMessage = (index: number) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    updateChat(updatedMessages);
  };

  const handleEditMessage = (index: number, newText: string) => {
    const updatedMessages = messages.map((msg, i) =>
      i === index ? { ...msg, text: newText } : msg
    );
    setMessages(updatedMessages);
    updateChat(updatedMessages);
  };

  const updateChat = (updatedMessages: Message[]) => {
    const now = new Date();
    const time = now.toISOString();
    const updatedChats = [...chats];
    updatedChats[currentChatIndex] = {
      ...updatedChats[currentChatIndex],
      lastMessageTime: time,
      messages: updatedMessages,
    };
    setChats(updatedChats);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    updateChatWithTitle(newTitle);
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
    updateChatWithDescription(newDescription);
  };

  const updateChatWithTitle = (newTitle: string) => {
    const updatedChats = [...chats];
    updatedChats[currentChatIndex] = {
      ...updatedChats[currentChatIndex],
      title: newTitle,
    };
    setChats(updatedChats);
  };

  const updateChatWithDescription = (newDescription: string) => {
    const updatedChats = [...chats];
    updatedChats[currentChatIndex] = {
      ...updatedChats[currentChatIndex],
      description: newDescription,
    };
    setChats(updatedChats);
  };

  const isScrollBelowHalf = () => {
    if (!scrollViewportRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current;
    // console.log("냥",scrollHeight - clientHeight)
    // console.log("녕",scrollTop)
    return scrollHeight - clientHeight * 1.2 < scrollTop;
  };

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop =
        scrollViewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollViewportRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollViewportRef.current;
        console.log(`Scroll Top: ${scrollTop}`);
        console.log(`Scroll Height: ${scrollHeight}`);
        console.log(`Client Height: ${clientHeight}`);
        console.log(`Scroll Bottom: ${scrollHeight - clientHeight}`);
      }
    };

    const scrollElement = scrollViewportRef.current;
    scrollElement?.addEventListener("scroll", handleScroll);

    return () => {
      scrollElement?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isScrollBelowHalf()) {
      scrollToBottom();
    } else {
      setShowNewMessagePopup(true);
    }
  }, [messages]);

  const handlePopupClick = () => {
    scrollToBottom();
    setShowNewMessagePopup(false);
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const fileContent =
      description +
      "\n" +
      messages
        .map((msg) => {
          const player = msg.player === "1p" ? "자아1" : "자아2";
          const time = new Date(msg.time).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `[${player}] [${time}] ${msg.text}`;
        })
        .join("\n");

    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "messages.txt";
    document.body.appendChild(element); // FireFox requires this for download
    element.click();
    document.body.removeChild(element);
  };

  const handleNewChat = () => {
    const newChat = {
      title: `${chats.length + 1}번째 자기대화`,
      description: ini_description,
      lastMessageTime: "",
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChatIndex(chats.length);
    setTitle(newChat.title);
    setDescription(newChat.description);
    setMessages(newChat.messages);
    setStopwatchRunning(true);
  };

  const handleLoadChat = (index: number) => {
    const chat = chats[index];
    setCurrentChatIndex(index);
    setTitle(chat.title);
    setDescription(chat.description);
    setMessages(chat.messages);
    setStopwatchRunning(true);
  };

  const handleDeleteChat = (index: number) => {
    const updatedChats = chats.filter((_, i) => i !== index);
    setChats(updatedChats);
    if (updatedChats.length === 0) {
      // handleNewChat();
    } else if (index === currentChatIndex) {
      setCurrentChatIndex(0);
      handleLoadChat(0);
    } else if (index < currentChatIndex) {
      setCurrentChatIndex((prevIndex) => prevIndex - 1);
    }
    setStopwatchRunning(false);
  };

  return (
    <Layout
      leftContent={
        <>
          <TypographyH1>SELF-TALK</TypographyH1>
          <div className={styles.iconContainer}>
            <div className={styles.iconWrapper}>
              <Image
                src="/images/plus_green.png"
                alt="New Chat"
                width={24 * 6}
                height={24 * 6}
                onClick={handleNewChat}
                className={styles.icon}
              />
              <span>new chat</span>
            </div>
            <div className={styles.iconWrapper}>
              <Image
                src="/images/download_green.png"
                alt="Download"
                width={24 * 6}
                height={24 * 6}
                onClick={downloadTxtFile}
                className={styles.icon}
              />
              <span>download chat</span>
            </div>
          </div>
          <Table>
            <TableCaption>대화 목록</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>마지막 대화일시</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.map((chat, index) => (
                <TableRow
                  key={index}
                  className={`${styles.pointerCursor} ${
                    index === currentChatIndex ? styles.activeChatRow : ""
                  }`}
                >
                  <TableCell
                    className="font-medium"
                    onClick={() => handleLoadChat(index)}
                  >
                    {chat.title}
                  </TableCell>
                  <TableCell onClick={() => handleLoadChat(index)}>
                    {chat.description}
                  </TableCell>
                  <TableCell onClick={() => handleLoadChat(index)}>
                    {chat.lastMessageTime
                      ? new Date(chat.lastMessageTime).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(index);
                    }}
                  >
                    ❌
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      }
      rightContent={
        chats.length > 0 && (
          <div className={styles.rightContent}>
            <ScrollArea
              className="h-full w-full rounded-md border p-4"
              ref={scrollViewportRef}
            >
              <div className={styles.chatinfo}>
                <div className={styles.editableContainer}>
                  {isEditingTitle ? (
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      onBlur={() => setIsEditingTitle(false)}
                      autoFocus
                      className={styles.editInput}
                    />
                  ) : (
                    <div onClick={() => setIsEditingTitle(true)}>
                      <TypographyH2>{title}</TypographyH2>
                    </div>
                  )}
                </div>

                <div className={styles.editableContainer}>
                  {isEditingDescription ? (
                    <textarea
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      onBlur={() => setIsEditingDescription(false)}
                      autoFocus
                      className={styles.editTextarea}
                    />
                  ) : (
                    <div onClick={() => setIsEditingDescription(true)}>
                      <TypographyP>{description}</TypographyP>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.chatContainer}>
                {messages.map((msg, index) => (
                  <ChatBubble
                    key={index}
                    is1P={msg.player === "1p"}
                    message={msg.text}
                    time={new Date(msg.time).toLocaleString("ko-KR", {
                      // year: "numeric",
                      // month: "2-digit",
                      // day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    onTogglePlayer={() => handleTogglePlayer(index)}
                    onDelete={() => handleDeleteMessage(index)}
                    onEdit={(newText: string) =>
                      handleEditMessage(index, newText)
                    }
                  />
                ))}
              </div>
            </ScrollArea>
            <div style={{ position: "relative" }}>
              <InputWithButton
                message={message}
                // onInputChange={handleInputChange}
                onSend={handleSend}
                player={player}
                setPlayer={setPlayer}
                setMessage={setMessage}
                // onTogglePlayer={togglePlayer}
              />
            </div>
            {showNewMessagePopup && (
              <div
                className={styles.newMessagePopup}
                onClick={handlePopupClick}
              >
                새로운 메시지가 도착했습니다.
              </div>
            )}
          </div>
        )
      }
    ></Layout>
  );
}
