import React, { useState, useEffect } from "react";
import { auth, db } from "./config";
import Login from "./Login";
import Tagging from "./Tagging";

export default function App() {
  const [userProfileName, setUserProfileName] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState("");

  const clear_inputs = () => {
    setEmail("");
    setPassword("");
  };

  const clear_errors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handle_login = () => {
    clear_errors();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res["user"]["_delegate"]["email"]);
        setUserProfileName(res["user"]["_delegate"]["email"]);
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handle_signup = () => {
    clear_errors();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res["user"]["_delegate"]["email"]);
        setUserProfileName(res["user"]["_delegate"]["email"]);
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handle_logout = () => {
    auth.signOut();
  };

  const auth_listener = () => {
    auth.onAuthStateChanged((user) => {
      clear_inputs();
      if (user) {
        setUser(user);
      } else {
        setUser("");
      }
    });
  };

  useEffect(() => {
    auth_listener();
  }, []);
  return (
    <div>
      {user ? (
        <Tagging
          handle_logout={handle_logout}
          userProfileName={userProfileName}
        />
      ) : (
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handle_login={handle_login}
          handle_signup={handle_signup}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
        />
      )}
    </div>
  );
}
