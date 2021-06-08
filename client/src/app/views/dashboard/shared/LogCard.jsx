
import React from "react";
import { Grid, Card, Table, TableBody, TableCell, TableRow } from "@material-ui/core";

const LogCards = ({keyLogs=[], userLogs=[], productLogs=[]}) => {

  return (
    <Grid container spacing={3} className="mb-6">
      <Grid item xs={12} md={4}>
        <Card elevation={3} className="p-4">
          <div className="items-center text-center">
            <h5 className="font-medium text-primary m-0 ml-3">Key Logs</h5>
          </div>
          <div className="pt-4 flex items-center"></div>
          <Table>
            <TableBody>
              {keyLogs.map((log) => (
              <TableRow>
                <TableCell align="left">
                {log}
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card elevation={3} className="p-4">
          <div className="items-center text-center">
            <h5 className="font-medium m-0 ml-3 text-primary">User Logs</h5>
          </div>
          <div className="pt-4 flex items-center"></div>
          <Table>
            <TableBody>
              {userLogs.map((log) => (
              <TableRow>
                <TableCell align="left">
                {log}
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card elevation={3} className="p-4">
          <div className="items-center text-center">
            <h5 className="font-medium text-primary m-0 ml-3">Product Logs</h5>
          </div>
          <div className="pt-4 flex items-center"></div>
          <Table>
            <TableBody>
              {productLogs.map((log) => (
              <TableRow>
                <TableCell align="left">
                {log}
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LogCards;
