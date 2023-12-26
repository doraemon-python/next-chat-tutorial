"use client"

import { useEffect, useRef, useState } from "react"

const ChatMain = () => {
  const wsRef = useRef<WebSocket>();
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<{ message: string, isMine: boolean }[]>([]);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new WebSocket("ws://localhost:8080");
    }

    return (() => {
      wsRef.current?.close();
      // 2回Render対策
      wsRef.current = undefined;
    })
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent<string>) => {
      setMessages([...messages, { message: e.data, isMine: false }]);
    }

    wsRef.current?.addEventListener("message", onMessage);

    return (() => {
      wsRef.current?.removeEventListener("message", onMessage);
    })
  }, [messages]);

  const action = (formData: FormData) => {
    setValue("");

    const message = formData.get("message") as string;
    setMessages([...messages, { message, isMine: true }]);

    if (message) {
      wsRef.current?.send(message);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-4 text-center">
      {messages.length > 0 && (
        <div className="mb-4 p-4 flex flex-col gap-2 bg-gray-200 rounded-xl">
          {messages.map((data, i) => (
            <div key={i} className={"flex flex-col " + (data.isMine ? "items-end" : "items-start")}>
              <p className="mx-1">{data.isMine ? "You" : "Other"}</p>
              <p
                className={"px-4 py-2 text-left rounded-md " + (data.isMine ? "bg-emerald-500 text-white" : "bg-white text-gray-800")}
              >
                {data.message}
              </p>
            </div>
          ))}
        </div>
      )}
      <form action={action} className="flex gap-4 justify-center">
        <input
          type="text"
          name="message"
          className="border-b border-gray-400 py-1 flex-grow"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Message"
          required
        />
        <button className="bg-sky-500 px-4 py-2 rounded-md text-white">Send</button>
      </form>
    </main>
  );
}

export default ChatMain;