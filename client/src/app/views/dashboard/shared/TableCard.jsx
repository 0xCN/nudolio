import React from "react";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

const TableCard = ({ productList = [] }) => {

  var limit = 30;

  return (
    <Card elevation={3} className="pt-5 mb-6">
      <div className="card-title px-6 mb-3">Top Selling Products</div>
      <div className="overflow-auto">
        <Table className="product-table">
          <TableHead>
            <TableRow>
              <TableCell className="px-6" colSpan={4} align="left">
                Name
              </TableCell>
              <TableCell className="px-0" colSpan={2}>
                Revenue
              </TableCell>
              <TableCell className="px-0" colSpan={2}>
                Keys Available
              </TableCell>
              <TableCell className="px-0" colSpan={1}>
                Keys Sold
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="px-6 capitalize" colSpan={4} align="left">
                  {product.name}
                </TableCell>
                <TableCell className="px-0 capitalize" align="left" colSpan={2}>
                  $
                  {product.revenue > 999
                    ? (product.revenue / 1000).toFixed(1) + "k"
                    : product.revenue}
                </TableCell>

                <TableCell className="px-0" align="left" colSpan={2}>
                  {product.available ? (
                    product.available < limit ? (
                      <small className="border-radius-4 bg-secondary text-white px-2 py-2px ">
                        {product.available} available
                      </small>
                    ) : (
                      <small className="border-radius-4 bg-primary text-white px-2 py-2px ">
                        {limit}+ Available
                      </small>
                    )
                  ) : (
                    <small className="border-radius-4 bg-error text-white px-2 py-2px ">
                      No Keys Left
                    </small>
                  )}
                </TableCell>
                <TableCell className="px-0" colSpan={1}>
                  {product.sold_keys}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TableCard;
