import React from "react";
import {Link, withRouter} from "react-router-dom";

/*
    just provide a header component for all pages, where we have a link to the home-page,
    and login/sign-out/logout buttons
*/
class HeaderBar extends React.Component{
    constructor(props) {
        super(props);
    }

    doLogout = async () => {
        const url = "/api/logout";

        let response;

        try {
            response = await fetch(url, {method: "post"});
        }catch (error) {
            alert("Failed to connect to server: " + error);
            return;
        }

        if(response.status !== 204) {
            alert("Error when connecting to server: Status code " + response.status);
            return;
        }

        this.props.updateLoggedInUser(null);
        this.props.history.push("/");
    };

    renderLoggedIn(userId){
        return(
            <React.Fragment>
                <p className="header-text">
                    Welcome {userId}
                    !!!
                </p>
                <button className="button" onClick={this.doLogout}>
                    Logout
                </button>
            </React.Fragment>
        );
    }

    renderNotLoggedIn (){
        return(
            <React.Fragment>
                <p className="header-text">You are not logged in</p>
                <div className="header">
                    <Link className="btn" to="/login">
                        LogIn
                    </Link>
                    <Link className="btn" to="/signup">
                        SignUp
                    </Link>
                    </div>
            </React.Fragment>
        );
    }

    render(){
        const userId = this.props.userId;

        let content;
        if (!userId){
            content = this.renderNotLoggedIn();
        }else{
            content = this.renderLoggedIn(userId);
        }

        return (
            <div className="headerBar">
                <Link className="homebtn" to={"/"}>
                    Home
                </Link>
                {content}
            </div>
        );
    }
}// end class HeaderBar

export default withRouter(HeaderBar);