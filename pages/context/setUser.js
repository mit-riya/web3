import React, { Component } from "react";
import { UserContext } from "./userContext"; // Ensure this matches the exported context
import styles from "./../../styles/setUser.module.css"; // Import the styles file

class SetUser extends Component {
    static contextType = UserContext; // Set the contextType to UserContext
    constructor(props) {
        super(props);
        // Initialize the component state
        this.state = {
            email: null, // Set initial email state to an empty string
        };
    }
    handleSetUser = async () => {
        const { email } = this.state; // Destructure email from the state
        try {
            if (email === null) {
                alert('Email cannot be null.');
                return;
            }
            await this.context.setAccount(email);
            console.log("User set successfully with email:", email);
        } catch (error) {
            console.error("Error setting user with email:", email, error);
        }
    };

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value }); // Update the email in the state
    };

    render() { 
        return (
            <div className={styles.container}>
                <h1 className={styles.heading1}>WELCOME BACK!</h1>
                <p class={styles.text}>Login with Metamask and your email</p>
                <input 
                    type="email" 
                    value={this.state.email} 
                    onChange={this.handleEmailChange}
                    placeholder="Enter your email"
                    className={styles.inputField} // Apply input field styles
                />
                <button onClick={this.handleSetUser} className={styles.buttonType2}>Connect with MetaMask</button> {/* Apply button styles */}
            </div>
        );
    }
}

export default SetUser;
