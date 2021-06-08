import React, { Component, Fragment } from 'react';
import DataTable, { createTheme } from "react-data-table-component";
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { fetchKeys } from "../../../redux/actions/KeyActions";
import Loading from "../../../../matx/components/MatxLoading/MatxLoading";
import DeleteDialog from './Delete';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import SearchBar from "material-ui-search-bar";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import { fetchProduct } from "../../../redux/actions/ProductActions";
import Generate from "./GenerateKeys";
import Assign from './Assign';
import ContextActions from './table/ContextActions';
import { styles, getProdName, getProdId } from './table/utils.js';
import { state, mapStateToProps } from './table/state.js';


createTheme('solarized', { context: { background: 'white' } });

class AdvancedPaginationTable extends Component {
  constructor(props) {
    super(props);
    this.state = state;
  }

  componentDidMount() {
    const { token, fetchKeys, fetchProduct } = this.props;
    fetchKeys(token, 1, this.state.perPage);
    fetchProduct({ token: token });
  };

  render() {
    const { token, page, data, loading, totalRows, fetchKeys, products } = this.props;

    /*
    * OPEN/CLOSE State Handlers: Manage Opening and Closing Dialog Boxes
    */
   
    const handleDeleteOpen = () => {
      this.setState({ open: true });
    };

    const handleDeleteClose = () => {
      this.setState({ open: false });
    };

    const handleCloseAssign = (reload=false) => {
      this.setState({ openAssign: false });
      if (reload) fetchKeys(token, page, this.state.perPage);
    }

    const handleOpenAssign = () => {
      this.setState({ openAssign: true });
    }

    const handleGenerateOpen = () => {
      this.setState({ openGenerate: true });
    };

    const handleGenerateClose = (reload = false) => {
      if (reload) {
        const { token, page } = this.props;
        fetchKeys(token, page, this.state.perPage);
      }
      this.setState({ openGenerate: false });
    };

    /*
    *  State Change Handlers: Managing Changes to Components
    */

    const handleSelectChange = (e) => {
      this.setState({ selector: e.target.value });
    }

    const handleSelectRowChange = (e) => {
      this.setState({ selectedRows: e.selectedRows });
    }

    const handlePageChange = (page) => {
      if (this.state.search === '') {
        fetchKeys(token, page, this.state.perPage);
      } else {
        // sends selector and search term in case user searched for something
        fetchKeys(token, page, this.state.perPage, this.state.search, this.state.selector);
      }
    };

    const handlePerRowsChange = async (newPerPage, page) => {
      this.setState({ perPage: newPerPage });
      fetchKeys(token, page, newPerPage);
    };


    /*
     Action Handlers
    */

    const handleDelete = (rows) => {
      this.setState({ selectedRows: [], deletedRows: rows });
    }

    const search = (search) => {
      if (this.state.selector === "product_id") {
        search = getProdId(search, products);
      }
      if (search === "None") {
        search = "";
      }
      fetchKeys(token, page, this.state.perPage, search, this.state.selector);
    };

    // Table Columns Structure
    const columns = [
      {
        name: 'Key',
        selector: 'key',
        sortable: true
      },
      {
        name: 'Price',
        selector: 'price',
        sortable: true,
        cell: row => <div data-tag="allowRowEvents">${row.price}</div>
      },
      {
        name: 'Activations',
        selector: 'activation_limit',
        sortable: true
      },
      {
        name: 'Product',
        selector: 'product_id',
        sortable: true,
        cell: row => <div data-tag="allowRowEvents">{getProdName(row.product_id, products)}</div>
      },
      {
        name: 'Date',
        selector: 'date',
        sortable: true,
        cell: row => <div data-tag="allowRowEvents"><div>{new Date(row.date).toLocaleDateString() + " " + new Date(row.date).toLocaleTimeString()}</div></div>
      },
    ];

    return (
      <Fragment>
        {/* Dialogs */}
        <Assign keys={this.state.selectedRows} open={this.state.openAssign} handleClose={handleCloseAssign}/>
        <Generate products={products} open={this.state.openGenerate} handleClose={handleGenerateClose} />
        <DeleteDialog handleDelete={handleDelete} handleClickOpen={handleDeleteOpen}
          handleClose={handleDeleteClose} open={this.state.open} keys={this.state.selectedRows} />

        {/* Top Bar: Searchbar, Selector, Add button */}
        <div style={styles.topBar}>
          
          <SearchBar width="25%"
            style={styles.searchBar} value={this.state.search}
            onCancelSearch={() => {
              this.setState({ search: '' });
              search('');
            }}
            onChange={(newValue) => this.setState({ search: newValue })}
            onRequestSearch={() => search(this.state.search)}
          />
          <FormControl variant="outlined">
            <Select
              labelId="demo-simple-select-outlined-label"
              value={this.state.selector}
              onChange={handleSelectChange}
              style={styles.select}
            >
              <MenuItem value={'key'}>key</MenuItem>
              <MenuItem value={'product_id'}>product</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleGenerateOpen} color="primary">
            <Add />
          </IconButton>
        </div>

        {/* Main Table */}
        <Card elevation={7}>
          <DataTable
            contextActions={
              <ContextActions
               selectedRows={this.state.selectedRows}
               styles={styles}
               handleAssignOpen={handleOpenAssign}
               handleDeleteOpen={handleDeleteOpen}
              />
            }
            columns={columns}
            data={data}
            progressPending={loading}
            progressComponent={<Loading />}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            striped={true}
            theme='solarized'
            selectableRows
            onSelectedRowsChange={handleSelectRowChange}
            selectedRows={this.state.selectedRows}
            title={<p style={{fontSize: '18px'}}>Unassigned Keys</p>}
            selectableRowSelected={(row) => {
              if (row in this.state.deletedRows) {
                return false;
              }
            }}
            paginationRowsPerPageOptions={[10, 15, 20, 30, 40, 50]}
          />
        </Card>
      </Fragment>
    );
  };
};


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchKeys: fetchKeys,
  fetchProduct: fetchProduct
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPaginationTable);