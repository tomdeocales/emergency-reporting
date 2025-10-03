"use client";

import { useChat } from "@ai-sdk/react";
import { Loader2, MessageCircle, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "Summarize the latest incident trends",
  "What should I review before the next briefing?",
  "List open action items from alerts",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    input: rawInput,
    handleSubmit,
    isLoading,
    setInput,
    error,
  } = useChat({ api: "/api/chat" });

  const currentInput = rawInput ?? "";
  const trimmedInput = currentInput.trim();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom when the message list updates.
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  useEffect(() => {
    if (messages.length === 0 && !isOpen) {
      setIsOpen(false);
    }
  }, [messages.length, isOpen]);

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen ? (
        <div className="w-[360px] rounded-xl border border-border/60 bg-background/95 shadow-xl ring-1 ring-border/35 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
          <header className="flex items-start justify-between gap-4 rounded-t-xl border-b border-border/60 bg-gradient-to-r from-primary/10 via-background/95 to-secondary/10 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                AI Assistant
              </p>
              <p className="text-xs text-muted-foreground">
                Powered by Context7 — ask for summaries, action items, or
                context.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </header>
          <div className="flex max-h-[420px] flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {hasMessages ? (
                <div className="space-y-4 text-sm">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border/60 bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <p>
                    Start the conversation to get tailored insights across
                    incidents, analytics, and alerts.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <Button
                        key={prompt}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-md text-xs"
                        onClick={() => {
                          setInput(prompt);
                          setIsOpen(true);
                        }}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {error ? (
                <p className="mt-3 rounded-md border border-destructive/60 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error.message ||
                    "We hit a snag reaching Context7. Try again shortly."}
                </p>
              ) : null}
            </div>
            <form
              onSubmit={handleSubmit}
              className="border-t border-border/60 bg-background/90 px-4 py-3"
            >
              <div className="flex items-end gap-4">
                <textarea
                  value={currentInput}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about incidents, analytics, or alerts..."
                  className="h-[60px] flex-1 resize-none rounded-lg border border-border/60 bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-label="Chat input"
                />
                <Button
                  type="submit"
                  disabled={isLoading || trimmedInput.length === 0}
                  className="rounded-md px-4"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              <div className="mt-2 hidden gap-2 text-xs text-muted-foreground sm:flex">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={`suggestion-${prompt}`}
                    type="button"
                    className="rounded-md bg-muted px-3 py-1 text-xs transition hover:bg-muted/60"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <Button
          type="button"
          size="icon"
          title="Chat with AI"
          aria-label="Chat with AI"
          className="h-14 w-14 rounded-full border border-primary/30 bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground shadow-2xl ring-1 ring-primary/50 transition hover:scale-105"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
