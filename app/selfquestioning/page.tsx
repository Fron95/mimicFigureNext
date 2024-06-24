"use client";

import styles from "./page.module.css";
import Link from "next/link";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import TypographyH1 from "@/components/selftalk/TypographyH1";
import TypographyH2 from "@/components/selftalk/TypographyH2";
import TypographyP from "@/components/selftalk/TypographyP";

import LoginForm from "@/components/selftalk/login";

import { Button } from "@/components/ui/button";
import InputWithButton from "@/components/selftalk/InputWithButton";
import Layout from "@/components/selftalk/Layout";
import ChatBubble from "@/components/selftalk/chatbubble";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  sendMessage,
  toggleMessagePlayer,
  deleteMessage,
  editMessage,
} from "@/services/selftalk/messageService";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

// supabase
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SupabaseChatRoom {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
}

interface Message {
  text: string;
  player: string;
  time: string;
  chatroom_id: string;
}

interface Chat {
  id: string; // 추가
  title: string;
  description: string;
  lastMessageTime: string;
  messages: Message[];
}

export default function Home() {
  const ini_title = `1번째 자기대화`;
  const ini_description =
    "이번 대화를 설명해주세요. 지난 대화를 찾거나 중심을 잡는데 도움이 됩니다.";

  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

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

  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoginFormActivated, setIsLoginFormActivated] =
    useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (userId) {
      loadUserChats();
    }
  }, [userId]);

  useEffect(() => {
    // 초기 로드 시 모든 채팅방 로드
    loadAllChats();
  }, []);

  const loadAllChats = async () => {
    const { data: allChats, error } = await supabase
      .from("selfchatRooms")
      .select("id, title, description, lastMessageTime");

    if (error) {
      console.error("Error fetching all chats:", error);
    } else {
      const chatsWithMessages = await Promise.all(
        allChats.map(async (chat) => {
          const { data: chatMessages, error: msgError } = await supabase
            .from("selfchatMessages")
            .select("text, player, time, chatroom_id")
            .eq("chatroom_id", chat.id);

          if (msgError) {
            console.error("Error fetching messages:", msgError);
            return { ...chat, messages: [] };
          }

          return { ...chat, messages: chatMessages };
        })
      );

      setChats(chatsWithMessages);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const isMobile = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const handleSend = async () => {
    if (message.trim() !== "") {
      const now = new Date();
      const time = now.toISOString();
      const currentChat = chats[currentChatIndex];
      const newMessage: Message = {
        text: message,
        player,
        time,
        chatroom_id: currentChat.id,
      };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setMessage("");

      const updatedChats = [...chats];
      updatedChats[currentChatIndex] = {
        ...updatedChats[currentChatIndex],
        lastMessageTime: time,
        messages: newMessages,
      };
      setChats(updatedChats);

      // Supabase에 메시지 저장
      const { error } = await supabase.from("selfchatMessages").insert([
        {
          chatroom_id: newMessage.chatroom_id,
          user_id: userId,
          message: newMessage.text,
          sent_at: time,
          player: newMessage.player,
        },
      ]);

      if (error) {
        console.error("Error creating message:", error);
      }

      // 모바일 환경에서 키보드 포커스 유지
      if (textareaRef.current) {
        textareaRef.current.focus();
      }

      if (isScrollBelowHalf()) {
        scrollToBottom();
      } else if (isMobile()) {
        scrollToBottom();
      } else {
        setShowNewMessagePopup(true);
      }
    }
  };

  const togglePlayer = () => {
    setPlayer(player === "1p" ? "2p" : "1p");
  };

  const handleTogglePlayer = async (index: number) => {
    const updatedMessages = messages.map((msg, i) =>
      i === index ? { ...msg, player: msg.player === "1p" ? "2p" : "1p" } : msg
    );
    setMessages(updatedMessages);
    updateChat(updatedMessages);

    // Supabase에서 메시지 업데이트
    await supabase
      .from("selfchatMessages")
      .update({ player: updatedMessages[index].player })
      .eq("chatroom_id", updatedMessages[index].chatroom_id)
      .eq("text", updatedMessages[index].text); // 정확한 메시지 식별을 위해 추가
  };

  const handleDeleteMessage = async (index: number) => {
    const messageToDelete = messages[index];
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);
    updateChat(updatedMessages);

    // Supabase에서 메시지 삭제
    await supabase
      .from("selfchatMessages")
      .delete()
      .eq("chatroom_id", messageToDelete.chatroom_id)
      .eq("text", messageToDelete.text);
  };

  const handleEditMessage = async (index: number, newText: string) => {
    const updatedMessages = messages.map((msg, i) =>
      i === index ? { ...msg, text: newText } : msg
    );
    setMessages(updatedMessages);
    updateChat(updatedMessages);

    // Supabase에서 메시지 업데이트
    await supabase
      .from("selfchatMessages")
      .update({ message: newText })
      .eq("chatroom_id", updatedMessages[index].chatroom_id)
      .eq("text", updatedMessages[index].text);
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
    return scrollHeight - clientHeight * 1.5 < scrollTop;
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

  const handleNewChat = async () => {
    const newChat = {
      id: uuidv4(),
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
    if (isMobile()) {
      toggleLeftVisibility();
    }

    // Supabase에 새로운 채팅방 저장
    const { data, error } = await supabase
      .from("selfchatRooms")
      .insert([
        {
          user_id: userId || "guest", // 로그인하지 않은 경우 guest 사용자로 설정
          title: newChat.title,
          description: newChat.description,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating chatroom:", error);
    } else if (data) {
      const chatroomId = data.id;
      setChats(
        chats.map((chat, index) =>
          index === currentChatIndex ? { ...chat, id: chatroomId } : chat
        )
      );
    }
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

  const handleDeleteChat = async (index: number) => {
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

    // Supabase에서 채팅방 삭제
    await supabase.from("selfchatRooms").delete().eq("id", chats[index].id);
  };

  const toggleLeftVisibility = () => {
    setIsLeftVisible((prev) => !prev);
  };

  const login = async () => {};

  const handleUserSubmit = async () => {
    try {
      // 사용자 정보 저장 또는 업데이트
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle(); // maybeSingle()을 사용하여 0개 또는 1개 행을 허용

      if (fetchError) {
        console.error("Error fetching user:", fetchError);
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
        return;
      }

      if (existingUser) {
        setUserId(existingUser.id);

        alert("다시 찾아주셔서 감사합니다.");
        loadUserChats();
      } else {
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([{ nickname, email }])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating user:", insertError);
          alert("사용자 정보를 저장하는 중 오류가 발생했습니다.");
          return;
        }

        setUserId(newUser.id);
        alert("사용자 정보가 저장되었습니다.");
        loadUserChats();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("사용자 정보를 처리하는 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  const loadUserChats = async () => {
    if (userId) {
      const { data: userChats, error } = await supabase
        .from("selfchatRooms")
        .select("id, title, description, lastMessageTime")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching chats:", error);
      } else {
        const chatsWithMessages = await Promise.all(
          userChats.map(async (chat) => {
            const { data: chatMessages, error: msgError } = await supabase
              .from("selfchatMessages")
              .select("text, player, time, chatroom_id")
              .eq("chatroom_id", chat.id);

            if (msgError) {
              console.error("Error fetching messages:", msgError);
              return { ...chat, messages: [] };
            }

            return { ...chat, messages: chatMessages };
          })
        );

        setChats(chatsWithMessages);
      }
    }
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
                <Button variant="outline">자문자답 추천사</Button>
              </Link>
            </div>
            <br />
            <div className={styles.userInputContainer}>
              {isLoginFormActivated ? (
                <LoginForm
                  onSubmit={handleUserSubmit}
                  setEmail={setEmail}
                  setNickname={setNickname}
                />
              ) : (
                <div
                  onClick={() => {
                    setIsLoginFormActivated(!isLoginFormActivated);
                  }}
                >
                  <Button>Login</Button>
                </div>
              )}
            </div>
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
          {chats.length === 0 && (
            <div className={styles.placeholder}>
              <Image
                src="/images/sample_conversation.jpg"
                alt="New Chat"
                width={24 * 18}
                height={24 * 18}
                onClick={handleNewChat}
              />
              <span>대화제공 : 오픈카톡방 우르슬라님</span>
            </div>
          )}
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
          {chats.length > 0 && (
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
          )}
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
