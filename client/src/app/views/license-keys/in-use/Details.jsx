import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TableContainer, TableHead, TableCell, TableRow, TextField, TableBody, Table } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { deleteKey } from '../../../redux/actions/KeyActions';


const useStyles = makeStyles((theme) => ({
  form: {
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
  textField: {
    margin: 10,
    color: 'black'
  },
  email: {
    margin: 10,
    width: '300px',
    color: 'black'
  },
  key: {
    border: '1px solid rgba(52, 49, 76, 0.54)',
    borderRadius: 5,
    width: '60px'

  },
  delete: {
    backgroundColor: '#ff352e',
    padding: 8,
    color: 'white',
    margin: 18,
    marginRight: 10,
    boxShadow: '0px 5px 5px -3px rgb(0 0 0 / 6%), 0px 8px 10px 1px rgb(0 0 0 / 4%), 0px 3px 14px 2px rgb(0 0 0 / 4%)',
    "&:hover": {
      backgroundColor: '#c70600'
    }
  },
  update: {
    backgroundColor: '#7467ef',
    padding: 8,
    color: 'white',
    marginTop: 18,
    marginBottom: 20,
    boxShadow: '0px 5px 5px -3px rgb(0 0 0 / 6%), 0px 8px 10px 1px rgb(0 0 0 / 4%), 0px 3px 14px 2px rgb(0 0 0 / 4%)',
    "&:hover": {
      backgroundColor: '#594be3'
    }
  }
}));


export default function Details(props) {

  const key = props.row;
  let hardwareIdsList = key.hardware_ids;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const user = useSelector(state => state.user);

  // State Handlers
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };


  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth='md'
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Key Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Key created at - {new Date(key.date).toLocaleDateString() + " " + new Date(key.date).toLocaleTimeString()}
          </DialogContentText>
          <div className={classes.div} noValidate>
            <TextField className={classes.textField} disabled defaultValue={key.key} label="key" variant='outlined' />
            <TextField className={classes.textField} disabled style={{width: '60px'}} defaultValue={'$'+key.price} label="price" variant='outlined' />
            <TextField className={classes.textField} disabled style={{ width: '200px' }} defaultValue={key.email} label="user email" variant='outlined' />
            <Button className={classes.delete} onClick={handleDeleteOpen} color="primary">
              Delete
            </Button>
          </div>
          <div className={classes.licenses}>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {key.activation_limit} activations remain
            </DialogContentText>
            </DialogContent>
            {hardwareIdsList && hardwareIdsList.length > 0 ? (<TableContainer><Table><TableHead>
              <TableRow>
                <TableCell width="11%" align="left">ID</TableCell>
                <TableCell width="60%" align="left">Hardware ID</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {hardwareIdsList.map((val, index) => {
                  return <TableRow key={index}>
                    <TableCell align="left" style={{ overflowX: 'auto' }} width="11%" component="th" scope="row">
                      {index}
                    </TableCell>
                    <TableCell width="60%" align="left">{val}</TableCell>
                  </TableRow>;
                })}
              </TableBody>
            </Table>
            </TableContainer>) : <DialogContentText>No Clients</DialogContentText>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Do you want to delete this key?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {key.key} will be permanently deleted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            dispatch(deleteKey(user.token, key.email, key._id));
            setTimeout(() => {
              handleDeleteClose();
              props.handleClose(true);
            }, 1000);

          }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}