import React, { Component } from "react";
import { Card, Button, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { register } from "../../redux/actions/LoginActions";
import { Link } from "react-router-dom"

const styles = theme => ({
  wrapper: {
    position: "relative"
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Register extends Component {
  state = {
    username: '',
    password: '',
    password_again: '',
    openSnack: false
  };

  _IsMounted = false;

  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
    this._IsMounted = true;
  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
    this._IsMounted = false;
  }

  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    let isMatch = this.state.password_again === this.state.password;
    let unameLength = this.state.username.length;
    let passLength = this.state.password.length;
    if(isMatch && unameLength >= 5 && passLength >= 8) {
      this.props.register(this.state.username, this.state.password);
      setTimeout(() => {
        this._IsMounted && this.setState({ openSnack: true });
      }, 1500);
    }
  };

  render() {
    let { username, password, password_again } = this.state;
    let { classes, login } = this.props;
    const error = login.error;
    
    const handleCloseSnack = () => {
      this.setState({ openSnack: false });
    }

    return (
      <div className="signup flex justify-center w-full h-full-screen">
        <div style={{ width: '450px', important: true }} className="p-8">
          <Card className="position-relative y-center">
            <div className="p-9 h-full bg-light-gray position-relative">
              <h3>Register</h3>
              <br/>
              <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                <TextValidator
                  className="mb-6 w-full"
                  variant="outlined"
                  label="Username"
                  onChange={this.handleChange}
                  type="text"
                  name="username"
                  value={username}
                  validators={["required"]}
                  minLength={5}
                  errorMessages={[
                    "this field is required",
                    "minimum is 5 characters"
                  ]}
                />
                <TextValidator
                  className="mb-3 w-full"
                  label="Password"
                  variant="outlined"
                  onChange={this.handleChange}
                  name="password"
                  type="password"
                  value={password}
                  validators={["required"]}
                  minLength={8}
                  errorMessages={["this field is required"]}
                />
                <TextValidator
                  className="mb-3 w-full"
                  label="Password Again"
                  variant="outlined"
                  onChange={this.handleChange}
                  name="password_again"
                  type="password"
                  value={password_again}
                  validators={["isPasswordMatch", "required"]}
                  errorMessages={["password mismatch", "this field is required"]}
                />
                <br></br>
                <div className="flex flex-wrap items-center mb-4">
                  <div style={styles.loginButton} className={classes.wrapper}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={this.props.login.loading}
                      type="submit"
                    >
                      Register
                    </Button>
                    <Button style={{marginLeft: '15px'}} component={Link} to="/session/signin">
                      Sign In
                    </Button>
                    {this.props.login.loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </div>
                </div>
              </ValidatorForm>
            </div>
          </Card>
          <Snackbar open={this.state.openSnack} autoHideDuration={2500} onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity={error === null ? 'success' : 'error'}>
              {error === null ? 'User Registered' : error}
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  register: PropTypes.func.isRequired,
  login: state.login
});
export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps, { register })(Register))
);
