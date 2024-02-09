import React, { useEffect , useState } from 'react';
import styles from "./../styles/chat.module.css"; // Import the styles file

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('../data/context.txt');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.text();
                setMessages(
                    [{"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": data},
                    {"role": "assistant", "content": "How can I help you today ?"}]
                );
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            }
        }
        fetchData();
    }, []); 

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
        <div className={styles.container}>
            <div className={styles.chatbox}>
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
                className={styles.inputForm}
            >
                <input
                    type="text"
                    name="input"
                    placeholder="Type your message..."
                    className={styles.inputField} // Apply input field styles
                />
                <button type="submit" className={styles.buttonType2}>Send</button> {/* Apply button styles */}
            </form>
        </div>
    );
};

export default Chatbot;
