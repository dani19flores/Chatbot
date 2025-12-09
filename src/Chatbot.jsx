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
        'adiós': '¡Adiós! Que tengas un buen día.',
        'cómo estás': 'Estoy bien, gracias por preguntar.',
        'qué puedes hacer': 'Puedo responder a tus preguntas básicas.'
    };

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

        // Process bot response
        const normalizedInput = inputValue.toLowerCase().trim();
        const botText = responses[normalizedInput] || 'Lo siento, no entiendo esa pregunta. Intenta con "hola", "cómo estás", "qué puedes hacer" o "adiós".';

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
