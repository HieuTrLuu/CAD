import React, {useContext} from "react";
import {
    Route,
    Redirect,
} from "react-router-dom";
import {UserContext} from "../../Contexts";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
    // useContext
  const {user, setUser} = useContext(UserContext);


    let props = { children, ...rest };
    return (
        <Route
            {...rest}
            render={({ location }) =>
                user
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


export default PrivateRoute;