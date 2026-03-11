import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "aiChats";
const BACKEND_BASE_URL =
  import.meta.env.VITE_AI_BACKEND_URL || "http://localhost:5000";

const starterPrompts = [
  "What services do you offer?",
  "Show me your tech stack",
  "Tell me about your best projects",
  "How can we work together?",
];

const createDefaultChat = () => {
  const now = Date.now();
  return {
    id: now,
    title: "New chat",
    messages: [
      {
        id: now + 1,
        role: "assistant",
        text: "Hi, I am Abdulwahab. Ask me about my projects, stack, or how I can help with your product.",
      },
    ],
  };
};

const normalizeMessageRole = (roleOrType) => {
  if (roleOrType === "assistant" || roleOrType === "ai") return "assistant";
  return "user";
};

const safeLoadChats = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createDefaultChat()];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [createDefaultChat()];

    return parsed.map((chat, i) => ({
      id: chat?.id ?? Date.now() + i,
      title: chat?.title || `Chat ${i + 1}`,
      messages: Array.isArray(chat?.messages)
        ? chat.messages.map((msg, index) => ({
            id: msg?.id ?? Date.now() + index,
            role: normalizeMessageRole(msg?.role || msg?.type),
            text: typeof msg?.text === "string" ? msg.text : "",
          }))
        : [],
    }));
  } catch {
    return [createDefaultChat()];
  }
};

const AiMe = () => {
  const [chats, setChats] = useState(safeLoadChats);
  const [currentChatId, setCurrentChatId] = useState(() => safeLoadChats()[0].id);
  const [inputText, setInputText] = useState("");
  const [visitorName, setVisitorName] = useState(
    () => localStorage.getItem("aiVisitorName") || "",
  );
  const [visitorEmail, setVisitorEmail] = useState(
    () => localStorage.getItem("aiVisitorEmail") || "",
  );
  const [needsIdentity, setNeedsIdentity] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serverOnline, setServerOnline] = useState(null);
  const [errorText, setErrorText] = useState("");

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  const currentMessages = useMemo(
    () => chats.find((chat) => chat.id === currentChatId)?.messages || [],
    [chats, currentChatId],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("aiVisitorName", visitorName);
  }, [visitorName]);

  useEffect(() => {
    localStorage.setItem("aiVisitorEmail", visitorEmail);
  }, [visitorEmail]);

  useEffect(() => {
    if (!chats.some((chat) => chat.id === currentChatId)) {
      setCurrentChatId(chats[0]?.id);
    }
  }, [chats, currentChatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isSending]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/health`);
        setServerOnline(res.ok);
      } catch {
        setServerOnline(false);
      }
    };

    checkHealth();
  }, []);

  const autosizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const updateChat = (chatId, updater) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updater(chat) } : chat)),
    );
  };

  const appendMessage = (chatId, message) => {
    updateChat(chatId, (chat) => ({ messages: [...chat.messages, message] }));
  };

  const renameChatFromFirstUserMessage = (chatId, text) => {
    const title = text.length > 40 ? `${text.slice(0, 40)}...` : text;
    updateChat(chatId, (chat) => ({ title: chat.messages.length <= 2 ? title : chat.title }));
  };

  const sendMessage = async (rawText) => {
    const text = rawText.trim();
    if (!text || isSending || !currentChatId) return;

    setErrorText("");
    setIsSending(true);
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "0px";

    const userMessage = { id: Date.now(), role: "user", text };
    appendMessage(currentChatId, userMessage);
    renameChatFromFirstUserMessage(currentChatId, text);

    try {
      const historyPayload = currentMessages.map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));
      const response = await fetch(`${BACKEND_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          visitorName: visitorName.trim(),
          visitorEmail: visitorEmail.trim(),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.requiresIdentity) {
        setNeedsIdentity(true);
      } else {
        setNeedsIdentity(false);
      }

      appendMessage(currentChatId, {
        id: Date.now() + 1,
        role: "assistant",
        text:
          typeof data.reply === "string" && data.reply.trim()
            ? data.reply
            : "I do not have a response yet.",
      });
      setServerOnline(true);
    } catch {
      setServerOnline(false);
      setErrorText(
        "Could not reach AI server. Start backend (`cd backend && npm start`) or set VITE_AI_BACKEND_URL.",
      );
      appendMessage(currentChatId, {
        id: Date.now() + 2,
        role: "assistant",
        text: "I am currently offline. Please start the backend server and try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const createNewChat = () => {
    const newChat = createDefaultChat();
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setErrorText("");
  };

  const deleteChat = (chatId) => {
    setChats((prev) => {
      const next = prev.filter((chat) => chat.id !== chatId);
      if (next.length === 0) return [createDefaultChat()];
      return next;
    });

    if (chatId === currentChatId) {
      const replacement = chats.find((chat) => chat.id !== chatId);
      setCurrentChatId(replacement?.id ?? chats[0]?.id);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0f0f0f] text-[#ececec]">
      <aside
        className={`${sidebarOpen ? "w-72" : "w-0"} overflow-hidden border-r border-white/10 bg-[#171717] transition-all duration-200`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={createNewChat}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            + New chat
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            x
          </button>
        </div>

        <div className="h-[calc(100vh-72px)] overflow-y-auto no-scrollbar px-2 pb-4">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                chat.id === currentChatId ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <span className="truncate pr-2">{chat.title}</span>
              <span
                className="text-xs text-white/50 hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
              >
                del
              </span>
            </button>
          ))}
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-md px-2 py-1 text-white/70 hover:bg-white/10 hover:text-white"
              >
                Menu
              </button>
            )}
            <h1 className="text-sm font-medium md:text-base">Kayode</h1>
          </div>

          <div
            className={`rounded-full px-2 py-1 text-xs ${
              serverOnline === null
                ? "bg-white/10 text-white/70"
                : serverOnline
                  ? "bg-green-600/20 text-green-300"
                  : "bg-red-600/20 text-red-300"
            }`}
          >
            {serverOnline === null ? "Checking..." : serverOnline ? "Online" : "Offline"}
          </div>
        </header>

        <section
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 pb-60 pt-6 md:px-6 no-scrollbar"
        >
          {currentMessages.length === 0 && (
            <div className="mx-auto max-w-3xl py-8">
              <h2 className="mb-4 text-xl font-medium">How can I help?</h2>
              <div className="grid gap-2 md:grid-cols-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="rounded-xl border border-white/15 bg-[#1b1b1b] px-4 py-3 text-left text-sm hover:bg-[#232323]"
                    onClick={() => sendMessage(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mx-auto max-w-3xl space-y-6">
            {currentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <div
                  className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    msg.role === "user"
                      ? "bg-[#2c2c2c] text-white"
                      : "bg-[#0ea5e9] text-black"
                  }`}
                >
                  {msg.role === "user" ? "You" : "Me"}
                </div>
                <div className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-7 md:text-[15px]">
                  {msg.text}
                </div>
              </div>
            ))}
            

            {isSending && (
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0ea5e9] text-[11px] font-semibold text-black">
                  Me
                </div>
                <div className="text-sm text-white/70">Typing...</div>
              </div>
            )}
          </div>
        </section>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-[#0f0f0f]/95 px-4 py-4 backdrop-blur md:px-6">
          <div className="mx-auto max-w-3xl">
            {errorText && <p className="mb-2 text-xs text-red-300">{errorText}</p>}
            <div className="mb-3 grid gap-2 md:grid-cols-2">
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-white/15 bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-white/40"
              />
              <input
                type="email"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                placeholder="Your email"
                className="rounded-xl border border-white/15 bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-white/40"
              />
            </div>
            {needsIdentity && (
              <p className="mb-2 text-xs text-amber-200">
                Please add your name and email so I can relay your message.
              </p>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-white/15 bg-[#1a1a1a] p-2">
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  autosizeTextarea();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(inputText);
                  }
                }}
                placeholder="Message Kayode"
                className="max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-white/40"
                disabled={isSending}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isSending}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-white/40">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiMe;
