import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    TableHead,
    Table,
    TableRow,
    TableCell,
    TableBody,
  } from "@material-ui/core";

export default function SalesDialog({sales, open, handleClose}) {
    const addComma = (stringNum) => {
        return stringNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"All Sales"}
        </DialogTitle>
        <DialogContent>
        <div className="w-full overflow-auto">
      <Table className="whitespace-pre">
        <TableHead>
          <TableRow>
            <TableCell className="px-0">Period</TableCell>
            <TableCell className="px-0">Revenue</TableCell>
            <TableCell className="px-0">Start Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
              <TableCell className="px-0 capitalize" align="left">Week</TableCell>
              <TableCell className="px-0 capitalize" align="left">${addComma(sales.week.revenue)}</TableCell>
              <TableCell className="px-0 capitalize">{new Date(sales.week.start_date).toLocaleDateString([],options)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-0 capitalize" align="left">Month</TableCell>
              <TableCell className="px-0 capitalize" align="left">${addComma(sales.month.revenue)}</TableCell>
              <TableCell className="px-0 capitalize">{new Date(sales.month.start_date).toLocaleDateString([],options)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-0 capitalize" align="left">Year</TableCell>
              <TableCell className="px-0 capitalize" align="left">${addComma(sales.year.revenue)}</TableCell>
              <TableCell className="px-0 capitalize">{new Date(sales.year.start_date).toLocaleDateString([],options)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-0 capitalize" align="left">All Time</TableCell>
              <TableCell className="px-0 capitalize" align="left">${addComma(sales.all_time)}</TableCell>
              <TableCell className="px-0 capitalize">...</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
