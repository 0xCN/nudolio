import React, { Component } from "react";
import { Fragment } from "react";
import { Button, IconButton, InputAdornment } from "@material-ui/core";
import { createUser, fetchUsers } from '../../../app/redux/actions/ClientUserActions';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import FormDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@material-ui/lab/Alert';


function validateEmail(email) {
    const re = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return !re.test(String(email).toLowerCase());
}

function Alert(props) {
    return <MuiAlert style={{ textDecorationColor: 'white' }} elevation={6} variant="filled" {...props} />;
}

const passRegex = new RegExp("^(?=.*[a-z])(?=.*[0-9])");

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            openSnack: false,
            name: '',
            nameErrorText: '',
            email: '',
            emailErrorText: '',
            password: '',
            passwordErrorText: ''
        }
    }

    render() {
        // Boolean Handlers
        const handleClickShowPassword = () => {
            let toggled = !this.state.showPassword;
            this.setState({ showPassword: toggled });
        }
        const handleCloseSnack = () => {
            this.setState({ openSnack: false });
        }

        // String Handlers w/ (Validations)
        const handleNameChange = (event) => {
            let str = event.target.value;
            if (str.length < 6) {
                this.setState({ nameErrorText: 'min char length is 6' });
            } else if (str.length > 30) {
                this.setState({ nameErrorText: 'max char lenght is 30' });
            } else {
                this.setState({ nameErrorText: ' ' });
                this.setState({ name: str });
            }
        }
        const handleEmailChange = (event) => {
            let str = event.target.value;
            if (str.length < 8) {
                this.setState({ emailErrorText: 'min char length is 8' });
            } else if (str.length > 255) {
                this.setState({ emailErrorText: 'max char lenght is 255' });
            } else if (validateEmail(str)) {
                this.setState({ emailErrorText: 'invalid email' })
            } else {
                this.setState({ emailErrorText: ' ' });
                this.setState({ email: str });
            }
        }
        const handlePasswordChange = (event) => {
            let str = event.target.value;
            if (!passRegex.test(str)) {
                this.setState({ passwordErrorText: 'both letters and numbers must be used' });
            } else if (str.length < 8) {
                this.setState({ passwordErrorText: 'min char length is 8' });
            } else if (str.length > 100) {
                this.setState({ passwordErrorText: 'max char lenght is 100' });
            } else {
                this.setState({ passwordErrorText: ' ' });
                this.setState({ password: str });
            }
        }

        // Actions
        const createUserAccount = () => {
            const { createUser } = this.props
            createUser({
                name: this.state.name,
                email: this.state.email,
                password: this.state.password
            });
        }

        return (<Fragment>
            <FormDialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create a User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        All the fields are required
                    </DialogContentText>
                    <TextField
                        onChange={e => handleNameChange(e)}
                        error={this.state.nameErrorText.length <= 1 ? false : true}
                        margin="normal"
                        id="name"
                        label="Name"
                        type="string"
                        helperText={this.state.nameErrorText}
                        required
                    />
                    <TextField
                        onChange={e => handleEmailChange(e)}
                        error={this.state.emailErrorText.length <= 1 ? false : true}
                        margin="normal"
                        id="email"
                        label="Email"
                        type="string"
                        fullWidth
                        helperText={this.state.emailErrorText}
                        required
                    />
                    <TextField
                        onChange={e => handlePasswordChange(e)}
                        error={this.state.passwordErrorText.length <= 1 ? false : true}
                        margin="normal"
                        id="email"
                        label="Password"
                        type={this.state.showPassword ? 'string' : 'password'}
                        helperText={this.state.passwordErrorText}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (this.state.passwordErrorText.length === 1 && this.state.emailErrorText.length === 1 && this.state.nameErrorText.length === 1) {
                                createUserAccount();
                                setTimeout(() => {
                                    if (this.props.error === null) {
                                        const { handleClose, fetchUsers, token, page, limit } = this.props;
                                        handleClose();
                                        fetchUsers(token, page, limit);
                                    }
                                    this.setState({ openSnack: true });
                                }, 1000);
                            }
                        }}
                        color="primary"
                    >
                        Create
                    </Button>
                </DialogActions>
            </FormDialog>
            <Snackbar open={this.state.openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity={this.props.error === null ? 'success' : 'error'}>
                    {this.props.error === null ? 'Account created successfully' : this.props.error}
                </Alert>
            </Snackbar>
        </Fragment>);
    }
}

const mapStateToProps = state => ({
    token: state.user.token,
    pending: state.users.pending,
    error: state.users.error,
    page: state.users.page,
    limit: state.users.limit
});

const mapDispatchToProps = dispatch => bindActionCreators({
    createUser: createUser,
    fetchUsers: fetchUsers
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Create);