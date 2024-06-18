"use client";
import styles from "./page.module.css";
import Link from "next/link";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import TypographyH1 from "@/components/selftalk/TypographyH1";
import TypographyH2 from "@/components/selftalk/TypographyH2";
import TypographyP from "@/components/selftalk/TypographyP";

import { Button } from "@/components/ui/button";
import InputWithButton from "@/components/selftalk/InputWithButton";
import Layout from "@/components/selftalk/Layout";
import ChatBubble from "@/components/selftalk/chatbubble";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

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
  const [isLeftVisible, setIsLeftVisible] = useState<boolean>(true);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const scrollChatViewportRef = useRef<HTMLDivElement>(null);
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const handleSend = () => {
    if (message.trim() !== "") {
      const now = new Date();
      const time = now.toISOString();
      const newMessages = [...messages, { text: message, player, time }];
      setMessages(newMessages);
      setMessage("");

      const updatedChats = [...chats];
      updatedChats[currentChatIndex] = {
        ...updatedChats[currentChatIndex],
        lastMessageTime: time,
        messages: newMessages,
      };
      setChats(updatedChats);

      console.log(textareaRef);

      // 모바일 환경에서 키보드 포커스 유지
      const textarea = document.querySelector("textarea");
      textarea?.focus;
      if (textareaRef.current) {
        console.log("zz");
        textareaRef.current.focus();
      }
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
    return scrollHeight - clientHeight * 1.2 < scrollTop;
  };

  const scrollChatToBottom = () => {
    if (scrollChatViewportRef.current) {
      scrollChatViewportRef.current.scrollTop =
        scrollChatViewportRef.current.scrollHeight;
    }
  };

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop =
        scrollViewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (scrollViewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollViewportRef.current;
    }
  });

  useEffect(() => {
    if (isScrollBelowHalf()) {
      scrollToBottom();
    } else if (isMobile()) {
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
      `title : ${title}` +
      "\n" +
      "\n" +
      `Description : ${description}` +
      "\n" +
      " ============================ " +
      "\n" +
      messages
        .map((msg) => {
          const player = msg.player === "1p" ? "1p" : "2p";
          const time = new Date(msg.time).toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `[${player}] [${time}] ${msg.text}`;
        })
        .join("\n");

    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleNewChat = () => {
    const newChat = {
      title: `${chats.length + 1}번째 자문자답`,
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
    setTimeout(scrollToBottom, 0); // 새로운 대화가 생성되었을 때 최하단으로 스크롤
    setTimeout(scrollChatToBottom, 0); // 새로운 대화가 생성되었을 때 최하단으로 스크롤
  };

  const handleLoadChat = (index: number) => {
    const chat = chats[index];
    setCurrentChatIndex(index);
    setTitle(chat.title);
    setDescription(chat.description);
    setMessages(chat.messages);
    setStopwatchRunning(true);
    if (isMobile()) {
      toggleLeftVisibility();
    }
    setTimeout(scrollToBottom, 0); // 대화 로드 후 최하단으로 스크롤
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

  const toggleLeftVisibility = () => {
    setIsLeftVisible((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile()) {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.stopImmediatePropagation();
            const { selectionStart, selectionEnd, value } = textarea;
            textarea.value =
              value.substring(0, selectionStart) +
              "\n" +
              value.substring(selectionEnd);
            textarea.selectionStart = textarea.selectionEnd =
              selectionStart + 1;
            e.preventDefault();
          }
        });
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, []);

  return (
    <Layout
      toggleLeftVisibility={toggleLeftVisibility}
      isLeftVisible={isLeftVisible}
      leftContent={
        <>
          <div
            className={`${styles.leftContent} ${
              isLeftVisible ? styles.visible : styles.hidden
            }`}
          >
            <TypographyH1>자문자답self-questioning</TypographyH1>
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
                <span>새로운 대화</span>
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
                <span>지금 대화 내보내기</span>
              </div>
            </div>
            <ScrollArea
              className="h-1/2 w-full rounded-md border p-4"
              ref={scrollChatViewportRef}
            >
              <div className="p-4">
                <TypographyP>
                  <strong>💬 대화목록</strong>
                </TypographyP>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>내용</TableHead>
                      <TableHead>삭제</TableHead>
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
                        <TableCell onClick={() => handleLoadChat(index)}>
                          <div
                            style={{ fontSize: "1.125rem", fontWeight: "bold" }}
                          >
                            {chat.title}
                          </div>
                          <div>{chat.description}</div>
                          <div style={{ color: "#aaa" }}>
                            {chat.lastMessageTime
                              ? new Date(chat.lastMessageTime).toLocaleString()
                              : ""}
                          </div>
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
              </div>
            </ScrollArea>
            <br />
            <div className={styles.buttonWrapperSecond}>
              <Link href="/selfquestioning/effects" passHref>
                <Button variant="outline">자문자답 사례/설명</Button>
              </Link>
            </div>
            <br />
            <p className="text-sm text-muted-foreground">
              💌 Contact : jsj950611@naver.com <br /> 개선제안 / 잡담 모두 환영{" "}
            </p>
          </div>
        </>
      }
      rightContent={
        <div
          className={`${styles.rightContent} ${
            isLeftVisible ? styles.rightContentHidden : ""
          }`}
        >
          {chats.length > 0 && (
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
                      style={{ height: "auto", resize: "none" }} // 모바일에서 textarea의 높이 조절
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
          )}
          <div>
            <InputWithButton
              message={message}
              onSend={handleSend}
              player={player}
              setPlayer={setPlayer}
              setMessage={setMessage}
              textareaRef={textareaRef}
            />
          </div>
          {showNewMessagePopup && (
            <div className={styles.newMessagePopup} onClick={handlePopupClick}>
              새로운 메시지가 도착했습니다.
            </div>
          )}
        </div>
      }
    ></Layout>
  );
}
