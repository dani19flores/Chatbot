# React Chatbot

Un chatbot simple e interactivo construido con **React** y **Vite**. Este proyecto demuestra el manejo de estado, eventos y renderizado condicional en React, junto con un diseño moderno y responsivo.

## Descripción

Este chatbot simula una conversación con un asistente virtual. Responde a un conjunto predefinido de palabras clave y cuenta con una interfaz de usuario limpia y amigable.

## Características

*   **Respuestas Predefinidas**: El bot reconoce palabras clave como "hola", "adiós", "cómo estás", y "qué puedes hacer".
*   **Interfaz Moderna**: Diseño atractivo con burbujas de chat distintivas para el usuario y el bot.
*   **Auto-scroll**: El chat se desplaza automáticamente hacia el último mensaje.
*   **Simulación de Escritura**: Pequeño retraso en las respuestas del bot para mayor realismo.
*   **Diseño Responsivo**: Funciona bien en dispositivos móviles y de escritorio.

## Tecnologías Utilizadas

*   **React**: Biblioteca para construir la interfaz de usuario.
*   **Vite**: Herramienta de compilación rápida para el desarrollo frontend.
*   **CSS3**: Estilos personalizados y diseño flexbox.

## Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar o descargar el proyecto**:
    Navega a la carpeta del proyecto.

2.  **Instalar dependencias**:
    Abre una terminal en la carpeta del proyecto y ejecuta:
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo**:
    Ejecuta el siguiente comando para iniciar la aplicación:
    ```bash
    npm run dev
    ```

4.  **Abrir en el navegador**:
    Visita la URL que aparece en la terminal (generalmente `http://localhost:5173`) para ver el chatbot en acción.

## Cómo Usar

Escribe un mensaje en el campo de texto y presiona "Enter" o haz clic en el botón "Enviar".
Intenta con los siguientes mensajes:
*   "Hola"
*   "Cómo estás"
*   "Qué puedes hacer"
*   "Adiós"

## Estructura del Proyecto

*   `src/Chatbot.jsx`: Componente principal que contiene la lógica y la estructura del chat.
*   `src/Chatbot.css`: Estilos específicos para el componente del chatbot.
*   `src/App.jsx`: Componente raíz que renderiza el chatbot.

---
Creado como práctica de desarrollo frontend con React.
