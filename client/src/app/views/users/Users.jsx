import React, { Component, Fragment } from "react";
import { connect } from "react-redux"
import { fetchUsers } from "../../redux/actions/ClientUserActions";
import { bindActionCreators } from 'redux';
import AdvancedPaginationTable from "./PaginationTable";


class Users extends Component {
  render() {
    return (
      <Fragment>
        <div className="userTable">
          <AdvancedPaginationTable />
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  data: state.users.docs,
  pending: state.users.pending,
  error: state.users.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProduct: fetchUsers,
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Users);