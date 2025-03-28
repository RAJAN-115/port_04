'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { MessageCircle, Mic, MicOff, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

// Define types for SpeechRecognitionEvent
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Rajan's AI assistant. How can I help?", isBot: true },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const router = useRouter();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { text: input, isBot: false }]);
    setInput('');
    simulateBotResponse();
  };

  const simulateBotResponse = () => {
    setIsLoading(true);
    setTimeout(() => {
      const responses = [
        "I'd be happy to tell you more about Rajan's projects!",
        'Rajan is skilled in MERN stack development and C++ programming.',
        "You can download Rajan's resume using the button on the home page.",
        'Feel free to explore the different sections of the portfolio!',
        'Rajan is passionate about AI and technology exploration.',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: randomResponse, isBot: true }]);
      setIsLoading(false);
    }, 1000);
  };

  // Microphone functionality
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;
  const recognition = SpeechRecognition ? new (SpeechRecognition as any)() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const command = event.results[current][0].transcript.toLowerCase();
      processCommand(command);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const toggleListening = () => {
    if (!recognition) {
      setFeedback('Voice recognition is not supported in your browser.');
      showFeedbackMessage();
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setFeedback('Stopped listening.');
      showFeedbackMessage();
    } else {
      setFeedback('Listening...');
      showFeedbackMessage();
      recognition.start();
      setIsListening(true);
    }
  };

  const processCommand = (command: string) => {
    const routes: { [key: string]: string } = {
      'go to home': '/',
      'home page': '/',
      about: '/about',
      'about me': '/about',
      education: '/education',
      study: '/education',
      skills: '/skills',
      abilities: '/skills',
      projects: '/projects',
      portfolio: '/projects',
      experience: '/experience',
      work: '/experience',
      contact: '/contact',
      'get in touch': '/contact',
    };

    const route = Object.keys(routes).find(key => command.includes(key));
    if (route) {
      setFeedback(`Navigating to ${route}...`);
      router.push(routes[route]);
    } else {
      setFeedback(`I heard: "${command}" but I don't understand that command.`);
    }

    showFeedbackMessage();
  };

  const showFeedbackMessage = () => {
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4 z-40">
      {/* Chat Bubble Button */}
      <Button
        onClick={toggleChat}
        className="rounded-full p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label="Chat with AI assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Microphone Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full p-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white`}
        onClick={toggleListening}
        aria-label={isListening ? 'Stop voice navigation' : 'Start voice navigation'}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-28 right-4 w-80 max-w-[calc(100vw-2rem)] flex flex-col shadow-lg border border-border">
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 p-3 text-white rounded-t-lg">
            <Typography variant="h6" className="text-white">
              AI Assistant
            </Typography>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:bg-purple-700"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 max-h-80 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    msg.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg px-3 py-2 max-w-[80%] bg-gray-300 text-gray-700">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              aria-label="Message input"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      )}

      {showFeedback && (
        <Alert className="fixed top-20 right-4 z-50 w-auto max-w-xs bg-background/95 backdrop-blur-sm border-purple-600/20">
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
