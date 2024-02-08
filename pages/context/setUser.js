import React, { Component } from "react";
import { UserContext } from "./userContext"; // Ensure this matches the exported context

class SetUser extends Component {
    static contextType = UserContext; // Set the contextType to UserContext

    handleSetUser = async () => {
        try {
            await this.context.setAccount(); // Correctly call setAccount as a function
            console.log("User set successfully!");
            // Accessing this.context.account immediately after setting it might not reflect the updated state due to async setState
        } catch (error) {
            console.error("Error setting user:", error);
        }
    };

    render() { 
        return (
            <button onClick={this.handleSetUser}>Connect with MetaMask</button>
        );
    }
}

export default SetUser;
