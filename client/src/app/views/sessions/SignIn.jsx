import React, { Component } from "react";
import { Card, Grid, Button, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { loginWithUnameAndPassword } from "../../redux/actions/LoginActions";
import { Link } from 'react-router-dom';


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

class SignIn extends Component {
  state = {
    username: "",
    password: "",
    openSnack: false,
  };

  _isMounted = false;

  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    this.props.loginWithUnameAndPassword({ ...this.state });
    setTimeout(() => {
      this._isMounted && this.setState({ openSnack: true });
    }, 1500);
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { username, password } = this.state;
    let { classes, login } = this.props;

    const error = login.error;

    const handleCloseSnack = () => {
      this.setState({ openSnack: false });
    }

    return (
      <div className="signup flex justify-center w-full h-full-screen">
        <div className="p-8">
          <Card className="signup-card position-relative y-center">
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="p-8 flex justify-center items-center h-full">
                  <img src="/assets/images/logos/logo.gif" alt="" />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="p-9 h-full bg-light-gray position-relative">
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <h3>Sign In</h3>
                    <br />
                    <TextValidator
                      className="mb-6 w-full"
                      variant="outlined"
                      label="Username"
                      onChange={this.handleChange}
                      type="text"
                      name="username"
                      value={username}
                      validators={["required"]}
                      errorMessages={[
                        "this field is required",
                        "username is not valid"
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
                      errorMessages={["this field is required"]}
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
                          Sign In
                        </Button>
                        {this.props.login.loading && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </div>
                      <Button style={{marginLeft: '15px'}} component={Link} to="/session/register">
                        Register
                      </Button>
                    </div>
                  </ValidatorForm>
                </div>
              </Grid>
            </Grid>
          </Card>
          <Snackbar open={this.state.openSnack} autoHideDuration={2500} onClose={handleCloseSnack}>
            <Alert onClose={handleCloseSnack} severity={error === null ? 'success' : 'error'}>
              {error === null ? 'Logged In' : error}
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginWithUnameAndPassword: PropTypes.func.isRequired,
  login: state.login
});
export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps, { loginWithUnameAndPassword })(SignIn))
);
