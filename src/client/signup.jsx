import React from 'react';
import {withRouter} from 'react-router-dom';

class SignUp extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            userId: "",
            password: "",
            confirm: "",
            errorMessage: null
        };
    }

    onUserIdChange = (event) => {
        this.setState({userId: event.target.value, errorMessage: null});
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value, errorMessage: null});
    };

    onConfirmChange = (event) => {
        this.setState({confirm: event.target.value, errorMessage: null});
    };

    doSignUp = async () => {

        const {userId, password, confirm} = this.state;

        if(confirm !== password){
            this.setState({errorMessage: "Passwords do not match"});
            return;
        }

        const url = "/api/signup";

        const payload = {userId: userId, password: password};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            this.setState({errorMessage: "Failed to connect to server: " + error});
            return;
        }


        if(response.status === 400){
            this.setState({errorMessage: "Invalid userId/password"});
            return;
        }

        if(response.status !== 201){
            this.setState({errorMessage: "Error when connecting to server: status code "+ response.status});
            return;
        }

        this.setState({errorMessage: null});
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push('/');
    };

    render(){

        let error = <div></div>;
        if(this.state.errorMessage){
            error =(<div className="errorMessage"><p>{this.state.errorMessage}</p></div>);
        }

        let confirmMessage = "Ok";
        if(this.state.confirm !== this.state.password){
            confirmMessage = "Not matching";
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
                <div>
                    <p>Confirm:</p>
                    <input type="password"
                           value={this.state.confirm}
                           onChange={this.onConfirmChange}
                    />
                    <div>{confirmMessage}</div>
                </div>

                {error}

                <button className="button" onClick={this.doSignUp}>
                    Sign Up
                </button>
            </div>
        );
    }
}

export default withRouter(SignUp);
