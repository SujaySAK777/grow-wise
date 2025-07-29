// ChatBot.tsx

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'bot',
    text: "Hello! I'm your agricultural assistant. I can help you with farming questions, crop advice, and more. You can type or speak to me!",
    timestamp: new Date()
  }]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<'en-IN' | 'hi-IN' | 'kn-IN'>('en-IN');

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const AGRI_PROMPT = `You are an expert agricultural assistant. Answer in ${
    lang === 'hi-IN' ? 'Hindi' : lang === 'kn-IN' ? 'Kannada' : 'English'
  }. Keep answers practical and short (2-3 sentences).`;

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = speechSynthesis.getVoices();
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    return () => {
      recognitionRef.current?.stop();
      speechSynthesis.cancel();
    };
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getVoiceForLang = (langCode: string): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current;
    return voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(langCode.split('-')[0])) || null;
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      const matchedVoice = getVoiceForLang(lang);
      if (matchedVoice) utterance.voice = matchedVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${AGRI_PROMPT}\n\nUser question: ${text}\nAnswer:` }] }]
          })
        }
      );
      const data = await response.json();
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not respond.';
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      speak(botResponse);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        text: 'Error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-green-600" />
              <CardTitle className="text-xl">Agricultural Assistant</CardTitle>
            </div>
            {isSpeaking && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Speaking...
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  message.type === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.type === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">Loading...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask your question..."
                disabled={isLoading}
                className="pr-12"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                {isSpeaking ? (
                  <Button type="button" size="sm" variant="ghost" onClick={() => speechSynthesis.cancel()} className="h-8 w-8 p-0">
                    <MicOff className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={isListening ? stopListening : startListening}
                    className={`h-8 w-8 p-0 ${isListening ? 'text-red-600' : ''}`}
                    disabled={isLoading}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isLoading || !inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              <label htmlFor="lang" className="text-sm text-gray-600">Lang:</label>
              <select
                id="lang"
                value={lang}
                onChange={(e) => setLang(e.target.value as 'en-IN' | 'hi-IN' | 'kn-IN')}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="en-IN">English 🇬🇧</option>
                <option value="hi-IN">Hindi 🇮🇳</option>
                <option value="kn-IN">Kannada 🇰🇳</option>
              </select>
            </div>
          </form>
          {isListening && (
            <p className="text-xs text-blue-600 mt-1 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Listening...
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatBot;
