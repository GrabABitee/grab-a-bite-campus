import { useState } from "react";
import { Bot, Send, X } from "lucide-react";

export default function AIChatbot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content: "Hi 👋 Ask me what to eat today!",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updated = [...messages, userMessage];

    setMessages(updated);

    /* ============================= */
    /* SIMPLE AI LOGIC */
    /* ============================= */

    let reply = "Try our chef special today 🍕";

    const lower = input.toLowerCase();

    if (lower.includes("cheap")) {
      reply = "You should try meals under ₹100 🍔";
    }

    else if (lower.includes("healthy")) {
      reply = "Masala dosa and salads are healthy options 🥗";
    }

    else if (lower.includes("spicy")) {
      reply = "Paneer Butter Masala is trending 🔥";
    }

    else if (lower.includes("drink")) {
      reply = "Cold Coffee is popular today ☕";
    }

    else if (lower.includes("pizza")) {
      reply = "Margherita Pizza is a student favorite 🍕";
    }

    setTimeout(() => {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);

    }, 600);

    setInput("");
  };

  return (

    <>

      {/* FLOAT BUTTON */}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-xl z-50"
      >
        <Bot />
      </button>

      {/* CHAT WINDOW */}

      {open && (

        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">

          {/* HEADER */}

          <div className="bg-orange-500 text-white p-4 flex items-center justify-between">

            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="font-semibold">
                GrabABite AI
              </span>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>

          </div>

          {/* MESSAGES */}

          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-orange-500 text-white ml-auto"
                    : "bg-white border"
                }`}
              >
                {msg.content}
              </div>

            ))}

          </div>

          {/* INPUT */}

          <div className="p-3 border-t flex gap-2">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI..."
              className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              className="bg-orange-500 text-white p-2 rounded-xl"
            >
              <Send size={16} />
            </button>

          </div>

        </div>

      )}

    </>
  );
}