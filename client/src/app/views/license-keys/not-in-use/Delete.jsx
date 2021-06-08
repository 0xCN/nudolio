import React, { Component } from "react";
import { Fragment } from "react";
import { Button } from "@material-ui/core";
import { deleteMultiKeys, fetchKeys } from '../../../../app/redux/actions/KeyActions';
import Snackbar from '@material-ui/core/Snackbar';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import FormDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class DeleteDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false
        }
    }

    render() {
        const { handleDelete, handleClose, fetchKeys, token,
            page, limit, keys, open, error, deleteMultiKeys } = this.props;
        // handlers
        const handleCloseSnack = () => this.setState({ openSnack: false });
        // actions
        const deleteKeys = () => deleteMultiKeys(token, keys);

        return (
            <Fragment>
                <FormDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Delete Keys</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete the selected keys?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            deleteKeys();
                            setTimeout(() => {
                                if (error === null) {
                                    handleClose();
                                    handleDelete(keys);
                                    fetchKeys(token, page, limit);
                                }
                                this.setState({ openSnack: true });
                            }, 1000);
                        }} color="primary">
                            Delete
                        </Button>
                    </DialogActions>
                </FormDialog>
                <Snackbar open={this.state.openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
                    <Alert onClose={handleCloseSnack} severity={error == null ? 'success' : 'error'}>
                        {error == null ? 'Keys Deleted' : error}
                    </Alert>
                </Snackbar>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token,
    pending: state.keys.pending,
    error: state.keys.error,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteMultiKeys: deleteMultiKeys,
    fetchKeys: fetchKeys
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(DeleteDialog);