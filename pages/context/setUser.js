import React, { Component } from "react";
import { UserContext } from "./userContext"; // Ensure this matches the exported context
import styles from "./../../styles/setUser.module.css"; // Import the styles file

class SetUser extends Component {
    static contextType = UserContext; // Set the contextType to UserContext
    constructor(props) {
        super(props);
        // Initialize the component state
        this.state = {
            email: '', // Initialize email state to an empty string instead of null for form handling
        };
    }

    handleSetUser = async () => {
        const { email } = this.state; // Destructure email from the state
        try {
            const emailInput = document.getElementById('email');
            if (!emailInput.validity.valid){
                alert("Invalid input. Enter your mail.");
                return;
            }
            if(this.state.account != null )return;
            if (!email) { // Check if email is empty
                alert('Email cannot be empty.');
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
        const { account } = this.context; // Destructure account from context

        // Conditionally render the email input only if account is null
        return (
            <div className={styles.container}>
                <h1 className={styles.heading1}>WELCOME BACK!</h1>
                <p className={styles.text}>Login with Metamask and your email</p>
                {account === null && (
                    <>
                        <input 
                            type="email" 
                            id="email"
                            value={this.state.email} 
                            onChange={this.handleEmailChange}
                            placeholder="Enter your email"
                            className={styles.inputField} // Apply input field styles
                        />
                    </>
                )}
                <button onClick={this.handleSetUser} className={styles.buttonType2}>Connect with MetaMask</button> {/* Apply button styles */}
            </div>
        );
    }
}

export default SetUser;
