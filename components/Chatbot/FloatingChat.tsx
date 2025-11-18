'use client';

import { useState, useEffect, useRef } from 'react';
import { Drawer, IconButton, TextField, Box, Typography, Avatar, CircularProgress } from '@mui/material';
import { Send, Close, SmartToy, OpenInFull, CloseFullscreen } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useFAB } from '@/contexts/FABContext';
import styles from './FloatingChat.module.css';

type AnimationState = 'idle' | 'pulse' | 'wave' | 'blink';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  parts: Array<{ text: string }>;
}

interface ChatApiResponse {
  response?: string;
  error?: string;
  details?: string;
  timestamp?: string;
  messageId?: string;
}

function formatTime(date: Date): string {
  try {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function FloatingChat() {
  const { isOpen: fabIsOpen } = useFAB();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef<Date>(new Date());
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (drawerOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: 'Hola 👋 Soy el asistente de OptimusAgency. Cuéntame qué tipo de proyecto web tienes en mente y en qué rango de tiempo te gustaría lanzarlo.',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }, [drawerOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!drawerOpen) {
      const scheduleNextAnimation = () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        const now = new Date();
        const timeSinceActivity = now.getTime() - lastActivityRef.current.getTime();
        const isInactive = timeSinceActivity > 180000; // 3 minutos

        let nextAnimationDelay: number;
        if (isInactive) {
          nextAnimationDelay = 30000 + Math.random() * 30000; // 30–60s
        } else {
          nextAnimationDelay = 60000 + Math.random() * 60000; // 60–120s
        }

        animationTimeoutRef.current = setTimeout(() => {
          const animations: AnimationState[] = ['pulse', 'wave', 'blink'];
          const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
          setAnimationState(randomAnimation);
          setTimeout(() => {
            setAnimationState('idle');
            scheduleNextAnimation();
          }, 2000);
        }, nextAnimationDelay);
      };

      scheduleNextAnimation();

      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    } else {
      setAnimationState('idle');
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    }
  }, [drawerOpen]);

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = new Date();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('scroll', handleActivity);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('scroll', handleActivity);
      }
    };
  }, []);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isLoading) return;

    const text = inputMessage.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    lastActivityRef.current = new Date();

    try {
      const payloadHistory: ChatHistoryItem[] = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        parts: [{ text: m.text }],
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: payloadHistory,
        }),
      });

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as ChatApiResponse;
        const errorMsg =
          errorData.error ||
          errorData.details ||
          'Error al enviar mensaje';
        throw new Error(errorMsg);
      }

      const data = (await res.json()) as ChatApiResponse;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const responseText = data.response || 'Lo siento, no pude procesar tu mensaje en este momento.';

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error enviando mensaje al chatbot:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo en unos segundos.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        className={`${styles.floatingButton} ${styles[animationState]}`}
        onClick={() => setDrawerOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        animate={{
          y: fabIsOpen ? -90 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        aria-label="Abrir asistente OptimusAgency"
      >
        <SmartToy className={styles.chatIcon} />
        {animationState !== 'idle' && (
          <motion.div
            className={styles.ripple}
            animate={{
              scale: [1, 2.1, 2.6],
              opacity: [0.5, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.button>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          className: `${styles.drawer} ${isMaximized ? styles.maximized : ''}`,
          sx: {
            width: isMaximized ? '100%' : { xs: '100%', sm: 420 },
            maxWidth: '100vw',
            backgroundColor: '#020617',
            borderLeft: 'none',
            boxShadow: isMaximized ? 'none' : '-8px 0 40px rgba(15,23,42,0.9)',
            height: '100vh',
            zIndex: isMaximized ? 1300 : 1200,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box className={styles.header}>
          <Box className={styles.headerContent}>
            <Avatar className={styles.headerAvatar}>
              <SmartToy fontSize="small" />
            </Avatar>
            <Box>
              <Typography className={styles.headerTitle}>
                Asistente OptimusAgency
              </Typography>
              <Typography className={styles.headerSubtitle}>
                Convierte clics en clientes en 14 días 🚀
              </Typography>
            </Box>
          </Box>

          <Box className={styles.headerActions}>
            <IconButton
              onClick={() => setIsMaximized((prev) => !prev)}
              className={styles.headerButton}
              size="small"
              aria-label={isMaximized ? 'Restaurar ventana' : 'Maximizar ventana'}
            >
              {isMaximized ? <CloseFullscreen fontSize="small" /> : <OpenInFull fontSize="small" />}
            </IconButton>
            <IconButton
              onClick={() => setDrawerOpen(false)}
              className={styles.headerButton}
              size="small"
              aria-label="Cerrar asistente"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box className={styles.messagesContainer}>
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.2 }}
                className={`${styles.messageWrapper} ${styles[message.sender]}`}
              >
                <Box className={styles.messageContainer}>
                  <Avatar className={`${styles.messageAvatar} ${styles[message.sender]}`}>
                    {message.sender === 'user' ? 'Tú' : <SmartToy fontSize="small" />}
                  </Avatar>
                  <Box className={`${styles.messageBubble} ${styles[message.sender]}`}>
                    <Typography className={styles.messageText}>{message.text}</Typography>
                    <Typography className={styles.messageTimestamp}>
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <Box className={styles.loadingIndicator}>
              <Box className={styles.loadingContainer}>
                <CircularProgress size={16} />
                <Typography className={styles.loadingText}>Pensando tu mejor opción…</Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Box className={styles.inputContainer}>
          <Box className={styles.inputWrapper}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Cuéntame qué quieres construir o qué duda tienes…"
              value={inputMessage}
              onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInputMessage(event.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className={styles.chatInput}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#020617',
                  borderRadius: '999px',
                  paddingRight: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(51,65,85,0.9)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1d4ed8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#22c55e',
                  },
                  color: '#e5e7eb',
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.9rem',
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={styles.sendButton}
              sx={{
                background: 'linear-gradient(135deg, #1d4ed8, #22c55e)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e40af, #16a34a)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(55,65,81,0.7)',
                  color: '#9ca3af',
                },
              }}
              aria-label="Enviar mensaje"
            >
              <Send fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

