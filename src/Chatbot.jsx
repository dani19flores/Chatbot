import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?', sender: 'bot' } // Initial greeting
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // --- TensorFlow.js intent classification setup ---
    // Simple training data: phrases and their intent labels
    const trainingData = [
        // Saludos
        { text: 'hola', label: 0 },
        { text: 'buenos dias', label: 0 },
        { text: 'buenas', label: 0 },
        { text: 'hey', label: 0 },
        { text: 'holi', label: 0 },
        { text: 'saludos', label: 0 },
        // Despedidas
        { text: 'adios', label: 1 },
        { text: 'chao', label: 1 },
        { text: 'hasta luego', label: 1 },
        { text: 'nos vemos', label: 1 },
        { text: 'me voy', label: 1 },
        // Estado
        { text: 'como estas', label: 2 },
        { text: 'que tal', label: 2 },
        { text: 'bien y tu', label: 2 },
        { text: 'bien', label: 2 },
        { text: 'mal', label: 2 },
        // Funcionalidad
        { text: 'que puedes hacer', label: 3 },
        { text: 'que haces', label: 3 },
        { text: 'para que sirves', label: 3 },
        { text: 'ayuda', label: 9 },
        // Chiste
        { text: 'dime un chiste', label: 4 },
        { text: 'cuentame un chiste', label: 4 },
        { text: 'hazme reir', label: 4 },
        // Hora y fecha
        { text: 'hora', label: 5 },
        { text: 'que hora es', label: 5 },
        { text: 'fecha', label: 6 },
        { text: 'que fecha es', label: 6 },
        // Agradecimiento
        { text: 'gracias', label: 7 },
        { text: 'muchas gracias', label: 7 },
        { text: 'te lo agradezco', label: 7 },
        // Identidad
        { text: 'quien eres', label: 8 },
        { text: 'nombre', label: 8 },
        { text: 'como te llamas', label: 8 },
        // Ayuda
        { text: 'ayuda', label: 9 },
        { text: 'necesito ayuda', label: 9 },
        { text: 'puedes ayudarme', label: 9 }
    ];

    // Intent labels
    const intentLabels = [
        'saludo', 'despedida', 'estado', 'funcionalidad', 'chiste', 'hora', 'fecha', 'agradecimiento', 'identidad', 'ayuda'
    ];

    // Simple tokenizer: split by space and assign index
    const allWords = Array.from(new Set(trainingData.map(d => d.text.split(' ')).flat()));
    const wordIndex = {};
    allWords.forEach((w, i) => { wordIndex[w] = i + 1; });

    // Convert text to tensor
    function textToTensor(text) {
        const tokens = normalizeText(text).split(' ');
        const arr = Array(6).fill(0); // max 6 words
        tokens.forEach((t, i) => {
            if (i < 6) arr[i] = wordIndex[t] || 0;
        });
        return tf.tensor2d([arr]);
    }

    // Model setup with localStorage persistence
    const [intentModel, setIntentModel] = useState(null);
    useEffect(() => {
        async function initModel() {
            try {
                // Intentar cargar modelo guardado
                const savedModel = await tf.loadLayersModel('indexeddb://intent-model');
                setIntentModel(savedModel);
            } catch (e) {
                // Si no existe, entrenar uno nuevo
                trainNewModel();
            }
        }

        async function trainNewModel() {
            const xs = tf.tensor2d(trainingData.map(d => {
                const tokens = normalizeText(d.text).split(' ');
                const arr = Array(6).fill(0);
                tokens.forEach((t, i) => {
                    if (i < 6) arr[i] = wordIndex[t] || 0;
                });
                return arr;
            }));
            const ys = tf.oneHot(tf.tensor1d(trainingData.map(d => d.label), 'int32'), intentLabels.length);

            const model = tf.sequential({
                layers: [
                    tf.layers.embedding({ inputDim: allWords.length + 2, outputDim: 8, inputLength: 6 }),
                    tf.layers.flatten(),
                    tf.layers.dense({ units: 16, activation: 'relu' }),
                    tf.layers.dense({ units: intentLabels.length, activation: 'softmax' })
                ]
            });
            model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

            await model.fit(xs, ys, { epochs: 100, verbose: 0 });
            
            // Guardar modelo en IndexedDB
            await model.save('indexeddb://intent-model');
            setIntentModel(model);
        }

        initModel();
    }, []);

    // Respuestas variadas por intención para más fluidez
    const intentResponses = {
        saludo: ['¡Hola! ¿Cómo estás?', '¡Hola! Es un placer hablar contigo.', '¡Saludos! ¿En qué puedo ayudarte?', '¡Hola! ¿Qué tal tu día?'],
        despedida: ['¡Adiós! Que tengas un buen día.', '¡Hasta luego! Fue un placer hablar contigo.', '¡Chao! Nos vemos pronto.', '¡Hasta la próxima!'],
        estado: ['Estoy bien, gracias por preguntar.', 'Todo va perfecto, ¡gracias!', 'Muy bien, ¿y tú cómo estás?', 'Excelente, listo para ayudarte.'],
        funcionalidad: ['Puedo responder a tus preguntas, contar chistes, decir la hora, fecha, y mucho más.', 'Soy tu asistente virtual. Puedo ayudarte con preguntas, chistes, hora y más.', 'Estoy aquí para charlar, contar chistes, y responder lo que necesites.'],
        chiste: ['¿Por qué el libro de matemáticas estaba triste? Porque tenía muchos problemas.', '¿Qué le dice un número al otro? Eres irracional.', '¿Cómo llama un árbol a su papá? Rama.'],
        hora: () => `La hora actual es ${new Date().toLocaleTimeString()}.`,
        fecha: () => `Hoy es ${new Date().toLocaleDateString()}.`,
        agradecimiento: ['De nada, para eso estoy.', '¡Es un placer ayudarte!', 'No hay problema, siempre disponible.'],
        identidad: ['Soy tu asistente virtual, tu compañero de conversación.', 'Puedes llamarme Asistente Virtual.', 'Soy un chatbot creado para ayudarte y hacerte compañía.'],
        ayuda: ['Puedes probar: "hola", "qué puedes hacer", "dime un chiste", "hora", "quién eres" o "gracias".', 'Intenta con frases como: saludo, preguntas, chistes, hora, o simplemente conversa.']
    };

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


        // Si el modelo está listo, usarlo para predecir la intención
        async function processIntent() {
            let botText = 'Lo siento, no entiendo esa pregunta. Intenta con "hola", "cómo estás", "qué puedes hacer", "dime un chiste" o "hora".';
            let usedIntent = false;
            if (intentModel) {
                const inputTensor = textToTensor(inputValue);
                const prediction = intentModel.predict(inputTensor);
                const predArray = await prediction.data();
                const intentIdx = predArray.indexOf(Math.max(...predArray));
                const confidence = predArray[intentIdx];
                if (confidence > 0.4) { // Si la confianza es suficiente, responde por intención
                    const intent = intentLabels[intentIdx];
                    usedIntent = true;
                    // Obtener respuesta aleatoria o dinámica según intención
                    const intentResp = intentResponses[intent];
                    if (Array.isArray(intentResp)) {
                        botText = intentResp[Math.floor(Math.random() * intentResp.length)];
                    } else if (typeof intentResp === 'function') {
                        botText = intentResp();
                    } else {
                        botText = intentResp || botText;
                    }
                }
            }
            // Si el modelo no reconoce la intención, usar coincidencia por palabras clave
            if (!usedIntent) {
                const normalizedInput = normalizeText(inputValue);
                for (const [key, resp] of Object.entries(normalizedResponses)) {
                    if (normalizedInput === key || normalizedInput.includes(key)) {
                        botText = typeof resp === 'function' ? resp() : resp;
                        break;
                    }
                }
            }
            setTimeout(() => {
                const botMessage = { text: botText, sender: 'bot' };
                setMessages(prev => [...prev, botMessage]);
            }, 500);
        }
        processIntent();

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
