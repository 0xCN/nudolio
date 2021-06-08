import React from "react";
import { Grid, Card, Icon, IconButton, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";

const styles = theme => ({
  icon: {
    fontSize: "44px",
    opacity: 0.6,
    color: theme.palette.primary.main
  }
});

const StatCards = ({ classes, totalUsers, thisWeekSales, keysInUse, productNum, handleOpen }) => {
  const history = useHistory();
  return (
    <Grid container spacing={3} className="mb-3">
      <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
            <Icon className={classes.icon}>group</Icon>
            <div className="ml-3">
              <small className="text-muted">Total Users</small>
              <h6 className="m-0 mt-1 text-primary font-medium">{totalUsers}</h6>
            </div>
          </div>
          <Tooltip title="Go to Page" placement="top">
            <IconButton onClick={() => { history.push('/users/'); }}>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
            <Icon className={classes.icon}>attach_money</Icon>
            <div className="ml-3">
              <small className="text-muted">Weekly Revenue</small>
              <h6 className="m-0 mt-1 text-primary font-medium">${thisWeekSales}</h6>
            </div>
          </div>
          <Tooltip title="View Details" placement="top">
            <IconButton onClick={handleOpen}>
              <Icon>visibility</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
            <Icon className={classes.icon}>vpn_key</Icon>
            <div className="ml-3">
              <small className="text-muted">Keys In-Use</small>
              <h6 className="m-0 mt-1 text-primary font-medium">
                {keysInUse}
              </h6>
            </div>
          </div>
          <Tooltip title="Go to Page" placement="top">
            <IconButton onClick={() => { history.push('/keys/in-use'); }}>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
            <Icon className={classes.icon}>wysiwyg</Icon>
            <div className="ml-3">
              <small className="text-muted">Products</small>
              <h6 className="m-0 mt-1 text-primary font-medium">{productNum}</h6>
            </div>
          </div>
          <Tooltip title="Go to Page" placement="top">
            <IconButton onClick={() => { history.push('/products/'); }}>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip>
        </Card>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles, { withTheme: true })(StatCards);
