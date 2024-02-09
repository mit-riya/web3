import React, { Component } from "react";
import { UserContext } from "./userContext"; // Ensure this matches the exported context

class SetUser extends Component {
    static contextType = UserContext; // Set the contextType to UserContext
    constructor(props) {
        super(props);
        // Initialize the component state
        this.state = {
            email: '', // Set initial email state to an empty string
        };
    }
    handleSetUser = async () => {
        const { email } = this.state; // Destructure email from the state
        try {
            // Pass the email as an argument to the setAccount method
            console.log(email);
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
            <div>
                <input 
                    type="email" 
                    value={this.state.email} 
                    onChange={this.handleEmailChange}
                    placeholder="Enter your email"
                />
                <button onClick={this.handleSetUser}>Connect with MetaMask</button>
            </div>
        );
    }
}

export default SetUser;
