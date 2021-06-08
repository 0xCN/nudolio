import React, { Component, Fragment } from "react";
import AdvancedPaginationTable from "./PaginationTable";


class Main extends Component {
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


export default Main;