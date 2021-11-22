import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import { connect } from "react-redux";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    // console.log(`chilren in Private route : ` + children.toString());
    // console.log(`rest in private route:` + rest.toString());
    let props = { children, ...rest };
    return (
        <Route
            {...rest}
            render={({ location }) =>
                props.isAuthenticated
                // false
                ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/signIn",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.Authentication.isAuthenticated,
    }
}

export default connect(mapStateToProps)(PrivateRoute);