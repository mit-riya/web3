import React, { Component } from "react";
import { UserContext } from "./userContext"; 
import styles from "./../../styles/setUser.module.css"; 

class SetUser extends Component {
    static contextType = UserContext; // Set the contextType to UserContext
    constructor(props) {
        super(props);
        // Initialize the component state
        this.state = {
            email: '', 
        };
    }

    handleSetUser = async () => {
        const { email } = this.state; // Destructure email from the state
        try {
            const emailInput = document.getElementById('email');
            if (!emailInput.validity.valid){
                // check if email entered is of valid form
                alert("Invalid input. Enter your mail.");
                return;
            }
            if(this.state.account != null)return;
            if (!email) { 
                // Check if email is empty
                alert('Email cannot be empty.');
                return;
            }
            // set email in context
            await this.context.setAccount(email);
        } catch (error) {
            console.error("Error setting user with email:", error);
        }
    };

    handleEmailChange = (event) => {
        // Update the email in the state of this component
        this.setState({ email: event.target.value }); 
    };

    render() { 
        const { account } = this.context; // Destructure account from context

        return (
            <div className={styles.container}>
                <h1 className={styles.heading1}>WELCOME!</h1>
                <p className={styles.text}>Login with Metamask and your email</p>
                {/* take email input if not entered before */}
                {account === null && (
                    <>
                        <input 
                            type="email" 
                            id="email"
                            value={this.state.email} 
                            onChange={this.handleEmailChange}
                            placeholder="Enter your email"
                            className={styles.inputField} 
                        />
                    </>
                )}
                {/* add login with metamask functionality */}
                <button onClick={this.handleSetUser} className={styles.buttonType2}>Connect with MetaMask</button> 
            </div>
        );
    }
}

export default SetUser;
