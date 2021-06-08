import axios from "axios";
import localStorageService from "./localStorageService";



class JwtAuthService {
  // You need to send http request with email and passsword to your server in this method
  // Your server will return user object & a Token
  // User should have role property
  // You can define roles in app/auth/authRoles.js
  loginWithUnameAndPassword = (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch('/rest/auth/login', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uname: username, password: password })
        }).then((data) => {
          data.json().then((result) => {
            if (result.message === "success") {
              resolve(result);
            } else {
              reject(result);
            }
          });
        });
      }, 1000);
    }).then(data => {
      // Login successful
      // Save token
      this.setSession(data.token);
      // Set user
      this.setUser(data);
      return data;
    });
  };

  // You need to send http requst with existing token to your server to check token is valid
  // This method is being used when user logged in & app is reloaded
  loginWithToken = async () => {
    const userInfo = await localStorageService.getItem("auth-user");
    const userToken = localStorage.getItem("auth-token");
    if (userInfo && userToken) {
      const data = await fetch('/rest/auth/checkToken', {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'auth-token': userToken },
        body: JSON.stringify({ uname: userInfo.displayName })
      });
      const result = await data.json();
      if (result.message === "token is valid") {
        this.setSession(await result.token);
        // Set user
        this.setUser(await result);
        return result;
      };
    }
  }

  logout = () => {
    this.setSession(null);
    this.removeUser();
  }

  // Set token to all http request header, so you don't need to attach everytime
  setSession = token => {
    if (token) {
      localStorage.setItem("auth-token", token);
      axios.defaults.headers.common["auth-token"] = token;
    } else {
      localStorage.removeItem("auth-token");
      delete axios.defaults.headers.common["auth-token"];
    }
  };

  // Save user to localstorage
  setUser = (user) => {
    localStorageService.setItem("auth-user", user);
  }
  // Remove user from localstorage
  removeUser = () => {
    localStorage.removeItem("auth-user");
  }
}

export default new JwtAuthService();
