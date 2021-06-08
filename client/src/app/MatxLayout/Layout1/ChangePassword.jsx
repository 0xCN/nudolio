import React, { Component } from "react";
import { Fragment } from "react";
import { Button } from "@material-ui/core";
import { changeUserPassword } from '../../redux/actions/UserActions';
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


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class ChangePassword extends Component {
  state = {
    openSnack: false,
    currentPass: '',
    newPass: '',
    newPass1: '',
    errorText: ''
  }

  render() {
    const { token, changePassword, handleClose   } = this.props;

    const handleCloseSnack = () => {
      this.setState({ openSnack: false });
    }

    // validations
    const handleNewPassChange = (event) => {
      let str = event.target.value;
      this.setState({ newPass: str });
    }

    const handleNewPass1Change = (event) => {
      let str = event.target.value;
      this.setState({ newPass1: str });
    }

    const handleCurrentPassChange = (event) => {
      let str = event.target.value;
      this.setState({ currentPass: str });
    }

    const handleValidation = () => {
      if (this.state.newPass !== this.state.newPass1) {
        this.setState({ errorText: 'password does not match' });
      } else {
        this.setState({ errorText: '' });
        changePassword(token, this.state.currentPass, this.state.newPass)
        setTimeout(() => {
          if (this.props.error === null) {
            handleClose(true);
          }
          this.setState({ openSnack: true });
        }, 1000);
      }
    }

    return (<Fragment>
      <FormDialog maxWidth={'sm'} fullWidth={true} open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle><div style={{ color: 'white', important: true }}>Change Password</div></DialogTitle>
        <DialogContent>
          <DialogContentText>
            minimum length is 8, and should have both characters and numbers.
          </DialogContentText>
          <TextField
            onChange={handleCurrentPassChange}
            margin="normal"
            label="Old Password"
            required
            variant="outlined"
            value={this.state.currentPass}
            fullWidth={true}
            type="password"
            
          />

          <TextField
            onChange={handleNewPassChange}
            margin="normal"
            label="New Password"
            required
            variant="outlined"
            value={this.state.newPass}
            fullWidth={true}
            type="password"
          />

          <TextField
            helperText={this.state.errorText}
            onChange={handleNewPass1Change}
            margin="normal"
            label="New Password Again"
            required
            variant="outlined"
            value={this.state.newPass1}
            error={this.state.errorText.length > 1}
            fullWidth={true}
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleValidation();
            }}
            color="secondary"
          >
            Change
          </Button>
        </DialogActions>
      </FormDialog>
      <Snackbar open={this.state.openSnack} autoHideDuration={2000} onClose={handleCloseSnack}>
        <Alert style={{ color: 'white' }} onClose={handleCloseSnack} severity={this.props.error == null ? 'success' : 'error'}>
          {this.props.error == null ? "Password Changed Successfully" : this.props.error}
        </Alert>
      </Snackbar>
    </Fragment>);
  }
}

const mapStateToProps = state => ({
  token: state.user.token,
  pending: state.user.pending,
  error: state.user.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changePassword: changeUserPassword
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
