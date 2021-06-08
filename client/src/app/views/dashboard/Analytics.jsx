import React, { Component, Fragment } from "react";
import { Grid, Card } from "@material-ui/core";

import DoughnutChart from "../charts/echarts/Doughnut";
import ModifiedAreaChart from "./shared/ModifiedAreaChart";
import StatCards from "./shared/StatCards";
import TableCard from "./shared/TableCard";
import StatCards2 from "./shared/StatCards2";
import SalesDialog from "./shared/SalesDialog";

import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import fetchDashboardAction from "../../redux/actions/DashboardActions";
import { toString } from "lodash";
import Loading from "../../../matx/components/MatxLoading/MatxLoading";


class Dashboard1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSales: false
    };
  }
 
  UNSAFE_componentWillMount() {
    const { fetchDashboard, user } = this.props;
    fetchDashboard(user);
  }

  getDoughnut(availableKeys, soldKeys) {
    if (availableKeys + soldKeys === 0) {
      return [{ value: 1, name: "No Keys" }]
    } else {
      return [{ value: soldKeys, name: "Asssigned" }, { value: availableKeys, name: "Not Asssigned" }]
    }
  }

  // Opening and Closing the revenue dialog
  handleClickOpen = () => {
    this.setState({ openSales: true });
  }
  handleClose = () => {
    this.setState({ openSales: false });
  }

  findIndex(tempList, product) {
    for (var i in tempList) {
      if (tempList[i] != null && tempList[i]._id === product._id)
        return i;
    }
    return -1;
  }

  render() {

    const { dashboard, pending } = this.props;
    if (pending) return (<div><h1><Loading /></h1></div>);

    let productList = [];
    let clientsNum = 0;
    let soldKeys = 0;
    let availableKeys = 0;
    let tempList = [];
    try {
      dashboard.products = dashboard.products.filter(function (i) { return i != null })
      tempList = [...dashboard.products];
    } catch (error) {
      return (<div><h1><Loading /></h1></div>);
    }

    dashboard.products.map((product, _) => {
        availableKeys += product.keys_overall - product.sold_keys.num;
        clientsNum += product.sold_keys.clients;
        soldKeys += product.sold_keys.num;
        return null;
      }
    );

    // product sort based on sold keys
    for (var index in tempList) {
      if (productList.length < 5) {
        var biggestProduct = tempList[index];
        // find the biggest product
        for (var i in tempList) {
          if (index < i) {
            if (biggestProduct.sold_keys.num < tempList[i].sold_keys.num){
              biggestProduct = tempList[i];
              tempList[i] = tempList[index];
              tempList[index] = biggestProduct;
            }
          }
        }
        // add it to our list
        productList.push({
          name: biggestProduct.name,
          revenue: biggestProduct.revenue,
          available: biggestProduct.keys_overall - biggestProduct.sold_keys.num,
          sold_keys: biggestProduct.sold_keys.num
        });
      }
    }

    let nums = [];

    const graph = dashboard.dashboard.graph;
    for (var key in graph) {
      if (key !== "start_date")
        nums.push(graph[key]);
    }
    return (
      <Fragment>
        <div className="pb-24 pt-7 px-8 bg-primary">
          <div className="card-title capitalize text-white mb-4 text-white-secondary">
            Last 12 months sales
          </div>
          <ModifiedAreaChart
            height="280px"
            option={{
              series: [
                {
                  data: nums,
                  type: "line"
                }
              ],
              xAxis: {
                data: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec"
                ]
              }
            }}
          ></ModifiedAreaChart>
        </div>
        <SalesDialog open={this.state.openSales} sales={dashboard.dashboard.sales} handleClose={this.handleClose} />

        <div className="analytics m-sm-30 mt--18">
          <Grid container spacing={3}>
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <StatCards handleOpen={this.handleClickOpen} productNum={dashboard.products.length} keysInUse={soldKeys.toString()} totalUsers={dashboard.normal_users.toString()} thisWeekSales={toString(dashboard.dashboard.sales.week.revenue).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              <TableCard productList={productList} />
            </Grid>

            {/* Top Selling Products */}

            <Grid item lg={4} md={4} sm={12} xs={12}>
              <Card className="px-6 py-4 mb-6">
                <div className="card-title">License Keys</div>
                <DoughnutChart
                  height="300px"
                  color={["rgb(143, 133, 242)", "#7467ef"]}
                  data={this.getDoughnut(availableKeys, soldKeys)}
                />
              </Card>

              <StatCards2 activatedSoft={`${clientsNum} Clients`} restApiTraffic={`${dashboard.dashboard.traffic.requests} Requests`} />
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  dashboard: state.dashboard.dashboard,
  pending: state.dashboard.pending,
  error: state.dashboard.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchDashboard: fetchDashboardAction
}, dispatch)


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard1);
