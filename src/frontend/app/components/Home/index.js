import React, { Component } from "react";
import { getFromStorage, setInStorage } from "../../utils/storage";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      signUpError: "",
      token: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
      url: "http://localhost:4000/user"
    };
  }
  componentDidMount() {
    const obj = getFromStorage("the_main_app");
    console.log("localStorage", obj);
    if (obj && obj.token) {
      const { token } = obj;
      //verify the token
      fetch(`${this.state.url}/verify?token=` + token)
        .then(res => res.json())
        .then(json => {
          console.log("compoetDidMt", json.status);
          if (json.status) {
            console.log("JSON ----", json);
            this.setState({
              token: token,
              isLoading: false
              // loggedIn: json.message
            });
          } else {
            console.log("while logout isDeleted parameter changed to true :( ");
            this.setState({
              isLoading: false
            });
          }
        })
        .catch(err => {
          console.log("CompoenentDidmoint", err);
          this.setState({
            isLoading: false
          });
        });
    } else {
      // console.log("DID erro");
      this.setState({
        isLoading: false
      });
    }
  }
  handleChange = e => {
    const name = e.target.name;
    console.log("changes", name);
    this.setState({
      [name]: e.target.value,
      signInError: "",
      signUpError: ""
    });
  };
  handleSignUp = () => {
    //Grab state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword
    } = this.state;
    console.log(typeof signUpFirstName);
    //Post req to backend
    fetch(`${this.state.url}/signup`, {
      method: "POST",
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json =>
        this.setState({
          signUpError: json.message,
          signUpEmail: "",
          signUpFirstName: "",
          signUpLastName: "",
          signUpPassword: ""
        })
      )
      .catch(err => console.log("Error", err));
  };
  handleSignIn = () => {
    //Grab state
    const { signInEmail, signInPassword, signInError } = this.state;
    //Post req to backend
    console.log(typeof signInEmail);
    //Post req to backend
    fetch(`${this.state.url}/signin`, {
      method: "POST",
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        setInStorage("the_main_app", { token: json.token });
        this.setState({
          signInError: json.message,
          signInEmail: "",
          signInPassword: "",
          token: json.token
        });
      })
      .catch(err => console.log("Error", err));
  };
  handleLogout = () => {
    this.setState({
      isLoading: true
    });
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // const { signInEmail, signInPassword, signInError } = this.state;
      //Post req to backend
      // console.log(typeof signInEmail);
      //Post req to backend
      fetch(`${this.state.url}/logout?token=` + token)
        .then(res => res.json())
        .then(json => {
          console.log("FETCH....");
          this.setState({
            token: "",
            isLoading: false,
            signInError: json.message
          });
        })
        .catch(err => console.log("Error", err));
    } else {
      this.setState({
        isLoading: false
      });
    }
  };
  render() {
    const {
      // loggedIn,
      isLoading,
      token,
      signInEmail,
      signInPassword,
      signUpFirstName,
      signUpLastName,
      signUpPassword,
      signUpEmail,
      signUpError,
      signInError
    } = this.state;
    console.log("isLoading", isLoading);
    console.log("tokeeeen", token);
    if (isLoading) {
      return <div> loading ...</div>;
    }
    if (!token) {
      return (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly"
            }}
          >
            <div>
              <input
                type="email"
                className="inputs"
                placeholder="Email"
                name="signInEmail"
                value={signInEmail}
                onChange={this.handleChange}
              />
              <br />
              <input
                type="password"
                className="inputs"
                placeholder="Password"
                name="signInPassword"
                value={signInPassword}
                onChange={this.handleChange}
              />
              <br />
              {signInError ? (
                <p style={{ color: "red" }}>{signInError}</p>
              ) : null}

              <button
                type="button"
                onClick={() => this.handleSignIn({})}
                className="button"
              >
                Signin
              </button>
            </div>

            <div>
              <input
                type="text"
                className="inputs"
                placeholder="FirstName"
                name="signUpFirstName"
                value={signUpFirstName}
                onChange={this.handleChange}
              />
              <br />
              <input
                type="text"
                className="inputs"
                placeholder="LastName"
                name="signUpLastName"
                value={signUpLastName}
                onChange={this.handleChange}
              />
              <br />
              <input
                type="email"
                className="inputs"
                placeholder="Email"
                name="signUpEmail"
                value={signUpEmail}
                onChange={this.handleChange}
              />
              <br />
              <input
                type="password"
                className="inputs"
                placeholder="Password"
                name="signUpPassword"
                value={signUpPassword}
                onChange={this.handleChange}
              />
              <br />
              {signUpError ? (
                <p style={{ color: "red" }}>{signUpError}</p>
              ) : null}
              <button
                type="button"
                onClick={this.handleSignUp}
                className="button"
              >
                Signup
              </button>
            </div>
          </div>
          <p style={{ color: "grey", fontSize: 20, flex: 1 }}>
            Please try to signup and then login if you dont have any account :)
          </p>
        </div>
      );
    }
    return (
      <div>
        <p>Welcome to your Account :) </p>
        <button type="button" className="button" onClick={this.handleLogout}>
          Logout
        </button>
      </div>
    );
  }
}
export default Home;
