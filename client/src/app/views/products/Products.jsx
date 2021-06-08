import React, { Component, Fragment } from "react";
import { Grid, IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import TextField from '@material-ui/core/TextField';
import FormDialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loading from "../../../matx/components/MatxLoading/MatxLoading";
import ProductCard from "./ProductCard";
import Button from '@material-ui/core/Button';
import { fetchProduct, createProduct } from "../../redux/actions/ProductActions";

const Add = (props) => {
  const [name, setName] = React.useState('');
  const [nameErrorText, setNameErrorText] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [descErrorText, setDescErrorText] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createProductFunc = (name, description) => {
    const { fetchProduct, createProduct, user } = props.props;
    createProduct(user.token, name, description);
    fetchProduct(user);
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

  return(<Fragment><div className="px-15 py-5 mb-6">
    <IconButton onClick={handleClickOpen}><AddIcon style={{fontSize:40}}></AddIcon></IconButton>
  </div>
  <FormDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This product can be later used for creating keys 
          </DialogContentText>
          <TextField
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
                createProductFunc(name, description);
                handleClose();
              }
            }} color="primary">
            Create
          </Button>
        </DialogActions>
      </FormDialog></Fragment>);
}


class Products extends Component {

  _isMounted = false;

  componentDidMount() {
    const { fetchProduct, user } = this.props;
    fetchProduct(user);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const forceU = () => {
      const { fetchProduct, user } = this.props;
      fetchProduct(user);
    }

    const { products, pending } = this.props;
    if (pending) return (<div><h1><Loading /></h1></div>);

    return (
    <Fragment>
    <div style={{margin: 20}}></div>
      <Grid container alignItems="center" justify='center' spacing={1}>
      <Add props={this.props}/>

      { this._isMounted && products ? products.filter(function (i) { return i != null }).reverse().map((value, index) => {
        return (
          <div key={index} className="px-6 py-2 mb-6"><ProductCard
            title={value.name}
            subtitle={value.description}
            keysOverall={value.keys_overall}
            clients={value.sold_keys.clients}
            soldKeys={value.sold_keys.num}
            revenue={value.revenue}
            lastUpdate={value.sold_keys.last_update}
            productId={value._id}
            removeProduct={forceU}></ProductCard>
        </div>);
      }):<div></div>}
      </Grid>
    </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  products: state.products.products,
  pending: state.products.pending,
  error: state.products.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProduct: fetchProduct,
  createProduct: createProduct
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Products);
