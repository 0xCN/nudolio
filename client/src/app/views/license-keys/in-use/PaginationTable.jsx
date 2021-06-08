import React, { Component, Fragment } from 'react';
import DataTable, { createTheme } from "react-data-table-component";
import { fetchKeys } from "../../../redux/actions/AssignedKeyActions";
import Loading from "../../../../matx/components/MatxLoading/MatxLoading";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import SearchBar from "material-ui-search-bar";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import { fetchProduct } from "../../../redux/actions/ProductActions";
import { styles, getProdName, getProdId } from './table/utils.js';
import { state, mapStateToProps } from './table/state.js';
import Details from './Details';
import { fetchUsers } from 'app/redux/actions/ClientUserActions';


createTheme('solarized', { context: { background: 'white' } });

class AdvancedPaginationTable extends Component {
  state = state;

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

    const handleDetailsClose = (deleted = false) => {
      if (deleted) {
        fetchKeys(token, page, this.state.perPage, this.state.search, this.state.selector);
      }
      this.setState({ openDetails: false });
    };

    /*
    *  State Change Handlers: Managing Changes to Components
    */
    const handleSelectChange = (e) => {
      this.setState({ selector: e.target.value });
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

    const search = (search) => {
      if (this.state.selector === "product_id") {
        search = getProdId(search, products);
      }
      if (search === "None") {
        search = "";
      }
      fetchKeys(token, page, this.state.perPage, search, this.state.selector);
    };

    const handleRowClick = (row) => {
      this.setState({selectedRow: row, openDetails: true});
    }

    // Table Columns Structure
    const columns = [
      {
        name: 'Key',
        selector: 'key',
        sortable: true
      },
      {
        name: 'Owner',
        selector: 'name',
        sortable: true
      },
      {
        name: 'Product',
        selector: 'product_id',
        sortable: true,
        cell: row => <div data-tag="allowRowEvents">{getProdName(row.product_id, products)}</div>
      },
      {
        name: 'Price',
        selector: 'price',
        sortable: true,
        cell: row => <div data-tag="allowRowEvents">${row.price}</div>
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
        <Details open={this.state.openDetails} row={this.state.selectedRow} handleClose={handleDetailsClose} />
        {/* Top Bar: Searchbar, Selector */}
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
              <MenuItem value={'email'}>email</MenuItem>
              <MenuItem value={'product_id'}>product</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Main Table */}
        <Card elevation={7}>
          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            progressComponent={<Loading />}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            onRowClicked={handleRowClick}
            striped={true}
            theme='solarized'
            paginationRowsPerPageOptions={[10, 15, 20, 30]}
            noHeader
            highlightOnHover
          />
        </Card>
      </Fragment>
    );
  };
};


const mapDispatchToProps = dispatch => bindActionCreators({
  fetchKeys: fetchKeys,
  fetchProduct: fetchProduct,
  fetchUsers: fetchUsers
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPaginationTable);