import React from 'react';
import {Link, withRouter} from "react-router-dom";

class Login extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            userId: "",
            password: "",
            errorMessage: null
        };
    }

    onUserIdChange = (event) => {
        this.setState({userId: event.target.value});
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value});
    };

    doLogIn = async () => {
        const {userId, password} = this.state;

        const url = "/api/login";

        const payload = {userId: userId, password: password};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
        }catch (error) {
            this.setState({errorMessage: "Failed to connect to server: " + error});
            return;
        }

        if(response.state === 401){
            this.setState({errorMessage: "Invalid userId/password"});
			return;
        }

        if(response.state === 204){
            this.setState({
                errorMessage: "Error when connecting to server: status code " + response.status});
			return;
        }

        this.setState({errorMessage: null});
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push('/');
    };

    render(){

        let error = <div></div>;
        if(this.state.errorMessage){
            error = (
                <div className="errorMessage">
                    <p>{this.state.errorMessage}</p>
                </div>
            );
        }

        return(
            <div className="center">
                <div>
                    <p>User Id:</p>
                    <input type="text"
                       value={this.state.userId}
                       onChange={this.onUserIdChange}
                    />
                </div>
                <div>
                    <p>Password:</p>
                    <input type="password"
                           value={this.state.password}
                           onChange={this.onPasswordChange}
                    />
                </div>

                {error}

                <button className="button" onClick={this.doLogIn}>
                    Login
                </button>
                {/*<link className="button" to={"/signup"}>*/}
                {/*    Register*/}
                {/*</link>*/}
            </div>
        );
    }// end render
}// end class Login

export default withRouter(Login);