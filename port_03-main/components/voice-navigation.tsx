'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define the SpeechRecognition interface
interface SpeechRecognition {
  new (): SpeechRecognition;
  start(): void;
  stop(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognition; // Use the defined type directly
    webkitSpeechRecognition: SpeechRecognition; // Use the defined type directly
  }
}

// Define types for SpeechRecognitionEvent
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export function VoiceNavigation() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Check if SpeechRecognition is available
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

  const processCommand = (command: string) => {
    // Navigation commands
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
    <>
      {showFeedback && (
        <Alert className="fixed top-20 right-4 z-50 w-auto max-w-xs bg-background/95 backdrop-blur-sm border-purple-600/20">
          <AlertDescription>{feedback}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
