import React, { Component } from "react";
import { Fragment } from "react";
import { Button } from "@material-ui/core";
import { assignKeys } from '../../../redux/actions/KeyActions';
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
import validator from 'validator';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class Assign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSnack: false,
      email: '',
      errorText: ''
    }
  }

  render() {
    const { token, keys, assignKeys, handleClose } = this.props;

    const handleCloseSnack = () => {
      this.setState({ openSnack: false });
    }

    // validations
    const handleEmailChange = (event) => {
      let email = event.target.value;
      this.setState({ email: email });
    }

    const handleValidation = () => {
      if (!validator.isEmail(this.state.email)) {
        this.setState({ errorText: 'This isn\'t a correct email format' });
      } else {
        this.setState({ errorText: '' });
        assignKeys(token, this.state.email, keys)
        setTimeout(() => {
          if (this.props.error == null) {
            handleClose(true);
          }
          this.setState({ openSnack: true });
        }, 1000);
      }
    }


    return (<Fragment>
      <FormDialog maxWidth={'sm'} fullWidth={true} open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Assign Keys</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign {keys.length} selected keys
          </DialogContentText>
          <TextField
            helperText={this.state.errorText}
            onChange={e => handleEmailChange(e)}
            margin="normal"
            label="Email"
            required
            variant="outlined"
            value={this.state.email}
            error={this.state.errorText.length > 1}
            fullWidth={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleValidation();
            }}
            color="primary"
          >
            Assign
          </Button>
        </DialogActions>
      </FormDialog>
      <Snackbar open={this.state.openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert  onClose={handleCloseSnack} severity={this.props.error == null ? 'success' : 'error'}>
          {this.props.error == null ? "Keys Assigned Successfully" : this.props.error}
        </Alert>
      </Snackbar>
    </Fragment>);
  }
}

const mapStateToProps = state => ({
  token: state.user.token,
  pending: state.keys.assignPending,
  error: state.keys.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  assignKeys: assignKeys
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Assign);
