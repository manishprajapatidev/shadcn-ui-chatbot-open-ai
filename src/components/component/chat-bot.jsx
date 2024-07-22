'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages([...messages, userMessage]);

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: input.trim() }),
    });

    const data = await response.json();
    const aiMessage = { sender: 'ai', text: data.result.trim() };

    setMessages([...messages, userMessage, aiMessage]);
    setInput('');
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6">
      <div className="w-full max-w-3xl bg-card rounded-xl shadow-lg flex flex-col justify-between h-full">
        <Card className="flex flex-col h-full">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  <Image src="/your-logo.png" alt="Logo" width={32} height={32} />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">AI Assistant</p>
                <p className="text-sm text-muted-foreground">Powered by OpenAI</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${msg.sender === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="sticky bottom-0 bg-card z-10">
            <form className="flex items-center w-full space-x-2" onSubmit={handleSubmit}>
              <Input
                id="message"
                placeholder="Type your message..."
                className="flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
              />
              <Button type="submit" size="icon">
                <SendIcon className="w-4 h-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
