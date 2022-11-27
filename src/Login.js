import React from "react";
import "./App.css";

export default function Login(props) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handle_login,
    handle_signup,
    hasAccount,
    setHasAccount,
    emailError,
    passwordError,
  } = props;
  return (
    <div className="main_login">
      <div className="container-login">
        <div className="item"></div>
        <div className="item">
          <center className="Login_cs">
            <input
              type="text"
              placeholder="Email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="error_msg">{emailError}</p>
            <input
              type="password"
              placeholder="Password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="error_msg">{passwordError}</p>
            <div>
              {hasAccount ? (
                <>
                  <button className="button-log" onClick={handle_login}>
                    Sign in
                  </button>
                  <p>
                    Don't have an account ?
                    <span onClick={() => setHasAccount(!hasAccount)}>
                      {" "}
                      Sign up
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <button className="button-log" onClick={handle_signup}>
                    Sign up
                  </button>
                  <p>
                    have an account ?
                    <span onClick={() => setHasAccount(!hasAccount)}>
                      {" "}
                      Sign in
                    </span>
                  </p>
                </>
              )}
            </div>
          </center>
        </div>
        <div className="item"></div>
      </div>
    </div>
  );
}
