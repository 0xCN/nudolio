import React, { Component } from "react";
import { Fragment } from "react";
import { Button } from "@material-ui/core";
import { generateKeys } from '../../../redux/actions/KeyActions';
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
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Generate extends Component {
  state = {
    openSnack: false,
    price: 0,
    count: 1,
    length: 16,
    activation_limit: 4,
    product: '',
    product_id: '',
  }

  render() {
    const { token, error, generateKeys, products, open, handleClose } = this.props;
  
    // generate keys
    const generate = () => {
      let data = {
        price: this.state.price,
        count: this.state.count,
        key_len: this.state.length,
        activation_limit: this.state.activation_limit,
        product_id: this.state.product_id
      }
      if (this.state.product_id === '' && products.length > 0) {
        data['product_id'] = getFirstProduct();
      }
      if (products.length > 0) {
        generateKeys(token, data);
        setTimeout(() => {
          if (error === null) {
            handleClose(true);
          }
          this.setState({ openSnack: true });
        }, 1000);
      }
    }

    // close snackbar
    const handleCloseSnack = () => {
      this.setState({ openSnack: false });
    }

    // validations
    const handlePriceChange = (event) => {
      let num = parseInt(event.target.value);
      if (num >= 0) this.setState({ price: num });
    }

    const handleCountChange = (event) => {
      let num = parseInt(event.target.value);
      if (num > 0 && num < 501) this.setState({ count: num });
    }

    const handleActivationChange = (event) => {
      let num = parseInt(event.target.value);
      if (num > 0) this.setState({ activation_limit: num });
    }

    const handleLengthChange = (event) => {
      let num = parseInt(event.target.value);
      if (num > 16 && num < 25) {    // handle key length
        this.setState({ length: num });
      }
    }

    const handleSelectChange = (e) => {
      const id = e.target.value;
      let P = '';
      for (let i = 0; i < products.length; i++) {
        // get product by ID
        if (products[i] != null && products[i]["_id"] === e.target.value) {
          P = products[i];
          break
        }
      }
      this.setState({ product: P.name, product_id: id });
    }

    const getFirstProduct = () => {
      if (products.length > 0) {
        return products.filter(function (i) { return i != null }).reverse()[0]["_id"];
      }
    }

    return (<Fragment>
      <FormDialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Generate Keys</DialogTitle>
        <DialogContent>
          <DialogContentText>
            All the fields are required
          </DialogContentText>
          <FormControl variant="outlined" >
            <InputLabel htmlFor="outlined-product-native-simple">Product</InputLabel>
            <Select
              native
              labelId="outlined-product-native-simple"
              id="demo-simple-select-outlined"
              onChange={handleSelectChange}
              label="Product"
              value={this.state.product_id}
              required
              style={{width: '150px'}}
            >
              {/* Mapping Products List */}
              {products.filter(function (i) { return i != null }).reverse().map((value, index) => {
                return (<option key={index} value={value._id}>{value.name}</option>);
              })}
            </Select>
          </FormControl>
          <br />
          <TextField
            onChange={e => handlePriceChange(e)}
            margin="normal"
            label="Price"
            type="number"
            required
            variant="outlined"
            style={{ marginRight: "10px" }}
            value={this.state.price}
          />
          <TextField
            onChange={e => handleCountChange(e)}
            margin="normal"
            label="Count"
            type="number"
            required
            variant="outlined"
            value={this.state.count}
          />
          <TextField
            onChange={e => handleActivationChange(e)}
            margin="normal"
            label="Activation Limit"
            required
            variant="outlined"
            type="number"
            value={this.state.activation_limit}
            style={{ marginRight: "10px" }}
          />
          <TextField
            onChange={e => handleLengthChange(e)}
            margin="normal"
            label="Key Length"
            type="number"
            required
            variant="outlined"
            value={this.state.length}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={generate}
            color="primary"
          >
            Generate
          </Button>

        </DialogActions>
      </FormDialog>
      <Snackbar open={this.state.openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity={error === null ? 'success' : 'error'}>
          {error === null ? 'Keys Generated Successfully' : error}
        </Alert>
      </Snackbar>
    </Fragment>);
  }
}

const mapStateToProps = state => ({
  token: state.user.token,
  pending: state.keys.pending,
  error: state.keys.error,
  page: state.keys.page,
  limit: state.keys.limit
});

const mapDispatchToProps = dispatch => bindActionCreators({
  generateKeys: generateKeys
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Generate);