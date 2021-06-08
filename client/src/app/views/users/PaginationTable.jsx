import React, { Component, Fragment } from 'react';
import DataTable, {createTheme} from "react-data-table-component";
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { fetchUsers } from "../../redux/actions/ClientUserActions";
import Loading from "../../../matx/components/MatxLoading/MatxLoading";
import Create from './CreateUser';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux"; 
import SearchBar from "material-ui-search-bar";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import Details from './Details'
import { fetchProduct } from "../../redux/actions/ProductActions";


createTheme('solarized', {
  text: {
    primary: 'black',
    secondary: 'black',
  },
  background: {
    default: 'white',
  },
  context: {
    background: 'white',
    text: 'black',
  },
  action: {
    button: 'rgba(0,0,0,.54)',
    hover: 'rgb(116,103,239,1)',
    highlight: 'rgb(116,103,239,1)',
    disabled: 'rgba(0,0,0,.12)',
  },
});

const styles = {
  base: {
    textAlign: 'center'
  },
  searchBar: {
    border: '10px',
    display: 'flex',
    width: '600px',
    marginRight: '20px',
    boxShadow: "0px 4px 5px -2px rgb(0 0 0 / 4%), 0px 7px 10px 1px rgb(0 0 0 / 3%), 0px 2px 16px 1px rgb(0 0 0 / 3%)"
  },
  select: {
    padding: '0px',
    height: '49px',
    marginRight: '4px',
    backgroundColor: 'white',
    display: 'inline-block'
  },

  topBar: {
    display: 'flex',
    marginBottom: '10px'
  }
}

const columns = [
  {
    name: 'Name',
    selector: 'name',
    sortable: true
  },
  {
    name: 'Email',
    selector: 'email',
    sortable: true
  },
  {
    name: 'Date',
    selector: 'date',
    sortable: true,
    cell: row => <div data-tag="allowRowEvents"><div>{new Date(row.date).toLocaleDateString() + " " + new Date(row.date).toLocaleTimeString()}</div></div>
  },
];

class AdvancedPaginationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openDetails: false,
      row: {},
      perPage: 10,
      search: '',
      selector: 'name',
      mobile: false
    };

  }

  componentDidMount () {
    const { token, fetchUsers, fetchProduct } = this.props;
    fetchUsers(token, 1, this.state.perPage);
    fetchProduct({token: token});
  };

  render() {
    const { token, data, loading, totalRows, fetchUsers, products } = this.props;

    const handleClickOpen = () => {
      this.setState({open: true});
    };

    const handleClose = () => {
      this.setState({open: false});
    };

    const search = (search) => {
      const { token, fetchUsers, page } = this.props;
      fetchUsers(token, page, this.state.perPage, search, this.state.selector);
    };

    const handleSelectChange = (e) => {
      this.setState({selector: e.target.value});
    }

    const handlePageChange = (page) => {
      if (this.state.search === '') {
        fetchUsers(token, page, this.state.perPage);
      } else {
        fetchUsers(token, page, this.state.perPage, this.state.search, this.state.selector);
      }
    };

    const handlePerRowsChange = async (newPerPage, page) => {
      this.setState({perPage: newPerPage});
      fetchUsers(token, page, newPerPage);
      console.log(this.state.search);
    };

    const handleDetailsClose = () => {
      const { token, page } = this.props;
      this.setState({ openDetails: false });
      fetchUsers(token, page, this.state.perPage);
    };

    const handleRowClick = row => {
      this.setState({ row: row });
      this.setState({ openDetails: true });
    }

    return (
      <Fragment>
        <div style={styles.topBar}>
          <Details products={products} open={this.state.openDetails} row={this.state.row} handleClose={handleDetailsClose}/>
          <SearchBar width="25%"
              style={styles.searchBar}
              value={this.state.search}
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
                id="demo-simple-select-outlined"
                value={this.state.selector}
                onChange={handleSelectChange}
                style={styles.select}
              >
                <MenuItem value={'name'}>name</MenuItem>
                <MenuItem value={'email'}>email</MenuItem>
                <MenuItem value={'id'}>id</MenuItem>
              </Select>
          </FormControl>
          <IconButton color="primary" onClick={handleClickOpen}>
            <Add />
          </IconButton>
        </div>
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
            noHeader={true}
            striped={true}
            style={{backgroundColor: 'white', marginTop: '0px'}}
            theme='solarized'
            highlightOnHover
            onRowClicked={handleRowClick}
          />
          <Create handleClickOpen={handleClickOpen} handleClose={handleClose} open={this.state.open} />
        </Card>
      </Fragment>
    );
  };
};

const mapStateToProps = state => ({
  token: state.user.token,
  pending: state.users.pending,
  error: state.users.error,
  data: state.users.docs,
  loading: state.users.pending,
  totalRows: state.users.totalDocs,
  page: state.users.page,
  products: state.products.products
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers: fetchUsers,
  fetchProduct: fetchProduct
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedPaginationTable);