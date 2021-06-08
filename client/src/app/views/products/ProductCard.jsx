import React from "react";
import {Fragment} from "react";
import { Button, Card, Grid, IconButton, Tooltip, Dialog } from "@material-ui/core";
import { deleteProduct, updateProduct, fetchProduct } from '../../../app/redux/actions/ProductActions';
import { classList } from "utils";
import DeleteIcon from '@material-ui/icons/Delete';
import {useSelector, useDispatch} from 'react-redux'

import TextField from '@material-ui/core/TextField';
import FormDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const card = {
  root: {
    width: 275
  },

  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 700
  },

  innerBlueCard: {
    width: 60,
    backgroundColor: '#9187f5',
    borderRadius: 4,
    textAlign: 'center',
    color: 'white'
  },

  innerOrangeCard: {
    width: 60,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#f59133',
    borderRadius: 4,
    textAlign: 'center',
    color: 'white'
  },

  innerBlackCard: {
    backgroundColor: '#323b59',
    borderRadius: 4,
    textAlign: 'center',
    color: 'white'
  },

  innerCardTitle: {
    color: 'white',
    fontSize: 18,
    display: 'inline-block',
    marginBottom: 0
  },

  innerCardText: {
    fontSize: 12,
    margin: 4,
    marginBottom: 8
  },

  editButton: {
    backgroundColor: '#7467ef',
    color: 'white',
    display: 'inline-block',
    marginRight: 20
  },
  deleteButton: {
    backgroundColor: '#f73939',
    color: 'white',
    display: 'inline-block',
    borderRadius: 3,
    padding: 6,
    marginRight: 4
  }
};

const Edit = React.forwardRef((data, ref) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [name, setName] = React.useState(data.productName);
  const [nameErrorText, setNameErrorText] = React.useState(' ');
  const [description, setDescription] = React.useState(data.productDesc);
  const [descErrorText, setDescErrorText] = React.useState(' ');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateProductFunc = (name, description) => {
    dispatch(updateProduct(user.token, data.id, name, description));
    dispatch(fetchProduct(user));
  }

  // validations
  const handleNameChange = (event) => {
    let str = event.target.value;
    if (str.length < 3) {
      setNameErrorText('min char length is 3');
    } else if (str.length > 30) {
      setNameErrorText('max char lenght is 30');
    } else {
      setNameErrorText(' ');
      setName(str);
    }
  }

  const handleDescChange = (event) => {
    let str = event.target.value;
    if (str.length < 3) {
      setDescErrorText('min char length is 3');
    } else if (str.length > 200) {
      setDescErrorText('max char lenght is 200');
    } else {
      setDescErrorText(' ');
      setDescription(str);
    }
  }

  return(<Fragment>
    <Button style={card.editButton} onClick={handleClickOpen}>Edit</Button>
  <FormDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit a Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit to your hearts content
          </DialogContentText>
          <TextField
            defaultValue={name}
            onChange={e => handleNameChange(e)}
            error = { nameErrorText.length <= 1 ? false : true }
            margin="normal"
            id="name"
            label="Name"
            type="string"
            helperText={nameErrorText}
            required
          />
          <TextField
            defaultValue={description}
            onChange={e => handleDescChange(e)}
            error = { descErrorText.length <= 1 ? false : true }
            margin="normal"
            id="description"
            label="Description"
            type="string"
            fullWidth
            multiline={true}
            rowsMax={3}
            helperText={descErrorText}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>{
              if ( descErrorText.length === 1 && nameErrorText.length === 1) {
                updateProductFunc(name, description);
                handleClose();
              }
            }} color="primary">
            Update
          </Button>
        </DialogActions>
      </FormDialog></Fragment>);
});


const ProductCard = ({
  children, title, subtitle,
  keysOverall, clients, soldKeys,
  revenue, lastUpdate, productId,
  removeProduct
 }) => {
  
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let lastUp = new Date(lastUpdate).toDateString();
  return (
    <Card elevation={6} className="px-6 py-5 h-full" style={card.root} >
      <Tooltip title={`_id: ${productId}`}>
        <div
          className={classList({
            "card-title": true,
            "mb-4": !subtitle
          })}
          style={card.title}
        > {title} </div>
      </Tooltip>
      {subtitle && <div className="card-subtitle mb-4">{subtitle}</div>}
      {children}
      <Grid container item direction="row" alignItems="center" justify="center" style={{ marginBottom: 20 }}>
        <div style={card.innerBlueCard}>
          <p style={card.innerCardTitle}>{keysOverall}</p>
          <p style={card.innerCardText}>All Keys</p>
        </div>
        <div style={card.innerOrangeCard}>
          <p style={card.innerCardTitle}>{clients}</p>
          <p style={card.innerCardText}>Clients</p>
        </div>
        <div style={card.innerBlackCard}>
          <p style={card.innerCardTitle}>{soldKeys}</p>
          <p style={card.innerCardText}>Sold Keys</p>
        </div>
      </Grid>
      <Tooltip title={`Delete this Product`}>
        <IconButton style={card.deleteButton} onClick={handleClickOpen}><DeleteIcon/></IconButton>
      </Tooltip>
      <Tooltip title={`Last Update: ${lastUp}`}>
        <Edit id={productId} productName={title} productDesc={subtitle} />
      </Tooltip>
      <p className='card-subtitle' style={{display: 'inline-block'}}>Revenue: ${revenue}</p>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Do you want to delete this product?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            be careful as this action is permanent!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            dispatch(deleteProduct(token, productId));
            handleClose();
            removeProduct(); 
            }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};



export default ProductCard;
