import React, { Component, Fragment } from "react";
import { CSVLink } from "react-csv";
import { Button, IconButton, Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';


class ContextActions extends Component {
  render() {
    const { handleAssignOpen, handleDeleteOpen, styles, selectedRows } = this.props;
    return (
      <Fragment>
        <Tooltip title="Export selected to CSV">
          <CSVLink
            data={selectedRows}
            filename={"keys.csv"}
            style={styles.export}
            target="_blank"
          >
            Export
          </CSVLink>
        </Tooltip>
        <Tooltip title="Assign selected keys to a user">
          <Button
            style={styles.assign}
            onClick={handleAssignOpen}
          >
            Assign
          </Button>
        </Tooltip>
        <Tooltip title="Delete Selected Rows">
          <IconButton onClick={handleDeleteOpen}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
  }
}


export default ContextActions;