import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TableContainer, TableHead, TableCell, TableRow, TextField, TableBody, Table, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../../../app/redux/actions/ClientUserActions';
import { deleteKey } from '../../../app/redux/actions/KeyActions';
import Tooltip from '@material-ui/core/Tooltip';


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
    borderRadius: 5

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

  let keyList = props.row.purchased_keys;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [keyOpen, setKeyOpen] = React.useState(false);
  const user = useSelector(state => state.user);
  const [deleted, setDeleted] = React.useState([]);
  const [key, setKey] = React.useState();

  // State Handlers
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleted([]);
  };
  const handleKeyClose = () => {
    setKeyOpen(false);
  };

  // Getting Product Name from ID
  const getProdName = (id) => {
    let P = props.products;
    for (let i = 0; i < P.length; i++) {
      if (P[i] != null) {
        if (P[i]["_id"] === id) {
          return P[i]["name"];
        }
      }
    }
    return 'None';
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth='md'
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">User Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            User account created at - {new Date(props.row.date).toLocaleDateString() + " " + new Date(props.row.date).toLocaleTimeString()}
          </DialogContentText>
          <div className={classes.div} noValidate>
            <TextField className={classes.textField} defaultValue={props.row.name} label="name" variant='outlined' />
            <TextField className={classes.email} defaultValue={props.row.email} label="email" variant='outlined' />
            <Tooltip title={keyList && keyList.length > 0 ? "all keys must be deleted before deleting a user":"delete user"} aria-label="add">
              <Button
                className={classes.delete}
                onClick={() => {
                  if (!(keyList && keyList.length > 0)) {
                    handleDeleteOpen();
                  }
                }}
                color="primary">Delete</Button>
            </Tooltip>

          </div>
          <div className={classes.licenses}>
            {keyList && keyList.length > 0 ? (<TableContainer><Table><TableHead>
              <TableRow>
                <TableCell width="34%" align="left">Key</TableCell>
                <TableCell width="11%" align="center">Activations</TableCell>
                <TableCell width="11%" align="center">Clients</TableCell>
                <TableCell width="11%" align="center">Product</TableCell>
                <TableCell width="11%" align="center">Price</TableCell>
                <TableCell width="11%" align="center">Date</TableCell>
                <TableCell width="11%" align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {keyList.map((val, index) => {if (!deleted.includes(index)) return (
                  <TableRow key={val._id}>
                    <TableCell align="left" style={{ overflowX: 'auto' }} width="34%" component="th" scope="row">
                      {val.key}
                    </TableCell>
                    <TableCell width="11%" align="center">{val.activation_limit - val.hardware_ids.length}</TableCell>
                    <TableCell width="11%" align="center">{val.hardware_ids.length}</TableCell>
                    <TableCell width="11%" align="center">{getProdName(val.product_id)}</TableCell>
                    <TableCell width="11%" align="center">${val.price}</TableCell>
                    <TableCell width="11%" align="center">{new Date(val.date).toLocaleDateString()}</TableCell>
                    <TableCell width="11%" align="center">
                      <IconButton onClick={()=>{
                        console.log(index);
                        setKeyOpen(true);
                        setKey([val, index]);
                      }}><DeleteIcon></DeleteIcon></IconButton>
                    </TableCell>
                  </TableRow>
                ); else return null})}
              </TableBody>
            </Table>
            </TableContainer>) : <DialogContentText>No Keys</DialogContentText>}
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
        <DialogTitle id="alert-dialog-title">Do you want to delete this user?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            be careful as this user, and keys, revenues, clients generated by this user. will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            dispatch(deleteUser(user.token, props.row._id));
            handleDeleteClose();
            // closes 'User Details'
            props.handleClose();
          }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={keyOpen}
        onClose={handleKeyClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure you want to delete this key?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            this action is permanent, and there will be no way to recover the data!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleKeyClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            setDeleted([...deleted, key[1]]);
            dispatch(deleteKey(user.token, props.row.email, key[0]._id));
            handleKeyClose();
          }} color="primary" autoFocus>
            Delete
          </Button> 
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}