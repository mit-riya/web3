/* chat.js */

import React, { useEffect, useState } from 'react';
import styles from "./../styles/chat.module.css"; // Import the styles file

// Chatbot component definition
const Chatbot = () => {
    // State variables for messages and error handling
    const [messages, setMessages] = useState([]); // State variable to hold chat messages
    const [error, setError] = useState(''); // State variable to handle errors

    // useEffect hook to fetch initial data
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch data from context.txt file
                const response = await fetch('../data/context.txt');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.text();
                // Set initial messages with system, user, and assistant roles
                setMessages([
                    { "role": "system", "content": "You are a helpful assistant." },
                    { "role": "user", "content": data },
                    { "role": "assistant", "content": "How can I help you today ?" }
                ]);
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            }
        }
        fetchData();
    }, []); // Dependency array to ensure useEffect runs only once on component mount

    // Function to fetch data from the OpenAI API
    const fetchData = async (currentMessages) => {
        try {
            // Fetch data from the OpenAI API endpoint
            const response = await fetch('/api/openai', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', // Indicate that we're sending JSON data
                },
                body: JSON.stringify(currentMessages), // Send current messages to the API
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json(); // Parse response as JSON
            if (data.choices && data.choices.length > 0) {
                // Concatenate new assistant message with current messages
                const newMessage = currentMessages.concat({ role: "assistant", content: data.choices[0].message.content });
                setMessages(newMessage); // Update messages state with new message
            } else {
                setError('No data received from OpenAI');
            }
        } catch (error) {
            console.error("Fetching error:", error); // Log fetching error
            setError(error.message); // Set error state with error message
        }
    };

    // Function to handle sending user messages
    const handleSendMessage = (messageContent) => {
        const currentMessages = messages.concat({ role: "user", content: messageContent }); // Concatenate new user message with current messages
        setMessages(currentMessages); // Update messages state with new message
        fetchData(currentMessages); // Fetch assistant response based on current messages
    };

    // Render chatbot component
    return (
        <div className={styles.container}>
            <div className={styles.chatbox}>
                {/* Map through messages and render them in the chatbox */}
                {messages.slice(3).map((message, index) => (
                    <div key={index}>
                        <h3>{message.role}</h3>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
            {/* Chat input form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission behavior
                    const input = e.target.input.value; // Get input value from form
                    if (input.trim() !== "") {
                        handleSendMessage(input); // Call function to handle sending message
                        e.target.reset(); // Reset form after message is sent
                    }
                }}
                aria-label="Chat Input Form"
                className={styles.inputForm} // Apply input form styles
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

export default Chatbot; // Export Chatbot component
