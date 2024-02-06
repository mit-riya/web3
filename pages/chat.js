import React, { useEffect , useState } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState(
        [{"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "This is a website for resume verification using decentralised blockchain technology."},
        {"role": "assistant", "content": "How can I help you today ?"}]
    );
    const [error, setError] = useState('');

    const fetchData = async (currentMessages) => {
        try {
        const response = await fetch('/api/openai',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json', // Indicate that we're sending JSON data
            },
            body: JSON.stringify(currentMessages),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const newMessage=currentMessages.concat({ role: "assistant", content: data.choices[0].message.content });
            setMessages(newMessage);
        } else {
            setError('No data received from OpenAI');
        }
        } catch (error) {
        console.error("Fetching error:", error);
        setError(error.message);
        }
    };

    const handleSendMessage = (messageContent) => {
        const currentMessages=messages.concat({ role: "user", content: messageContent });
        setMessages(currentMessages);
        fetchData(currentMessages);
    };

    return (
        <>
        <div>
            {messages.slice(3).map((message, index) => (
            <div key={index}>
                <h3>{message.role}</h3>
                <p>{message.content}</p>
            </div>
            ))}
        </div>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.input.value;
                if (input.trim() !== "") {
                    handleSendMessage(input);
                    e.target.reset();
                }
            }}
            aria-label="Chat Input Form"
        >
            <input
            type="text"
            name="input"
            placeholder="Type your message..."
            />
            <button type="submit">
            Send
            </button>
        </form>
        </>
    );
};

export default Chatbot;