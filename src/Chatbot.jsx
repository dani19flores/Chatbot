import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?', sender: 'bot' } // Initial greeting
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const responses = {
        'hola': '¡Hola! ¿Cómo estás?',
        'buenos días': '¡Buenos días! ¿En qué puedo ayudarte?',
        'buenas': '¡Hola! ¿Qué tal?',
        'adiós': '¡Adiós! Que tengas un buen día.',
        'chao': '¡Hasta luego!',
        'cómo estás': 'Estoy bien, gracias por preguntar.',
        'gracias': 'De nada, para eso estoy.',
        'qué puedes hacer': 'Puedo responder a tus preguntas básicas, contarte un chiste, decir la hora, o simplemente conversar.',
        'dime un chiste': '¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.',
        'quién eres': 'Soy tu asistente virtual creado para ayudarte.',
        'nombre': 'Puedes llamarme Asistente Virtual.',
        'hora': () => `La hora actual es ${new Date().toLocaleTimeString()}.`,
        'fecha': () => `Hoy es ${new Date().toLocaleDateString()}.`,
        'ayuda': 'Puedes probar consultas como "hola", "dime un chiste", "qué puedes hacer", "hora", o "gracias".'
    };

    // Normalize text: remove accents/diacritics, punctuation and lower-case
    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .trim();
    };

    // Build a normalized responses map so matching is accent- and punctuation-insensitive
    const normalizedResponses = {};
    Object.entries(responses).forEach(([k, v]) => {
        const nk = normalizeText(k);
        if (!normalizedResponses[nk]) normalizedResponses[nk] = v;
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // Process bot response with more flexible, accent-insensitive matching
        const normalizedInput = normalizeText(inputValue);

        let botText = 'Lo siento, no entiendo esa pregunta. Intenta con "hola", "cómo estás", "qué puedes hacer", "dime un chiste" o "hora".';

        for (const [key, resp] of Object.entries(normalizedResponses)) {
            if (normalizedInput === key || normalizedInput.includes(key)) {
                botText = typeof resp === 'function' ? resp() : resp;
                break;
            }
        }

        setTimeout(() => {
            const botMessage = { text: botText, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        }, 500);

        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Asistente Virtual</h2>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="message-bubble">
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input-area">
                <input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chatbot;
