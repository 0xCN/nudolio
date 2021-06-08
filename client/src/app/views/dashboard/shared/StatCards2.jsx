import React from "react";
import { Grid, Card, Icon, Fab } from "@material-ui/core";

const StatCards2 = ({activatedSoft="0", restApiTraffic="0 requests"}) => {
  return (
    <Grid container spacing={3} className="mb-6">
      <Grid item xs={12} md={12}>
        <Card elevation={3} className="p-4">
          <div className="flex items-center">
            <Fab
              size="medium"
              className="bg-light-green circle-44 box-shadow-none"
            >
              <Icon className="text-green">trending_up</Icon>
            </Fab>
            <h5 className="font-medium text-green m-0 ml-3">Activated Softwares</h5>
          </div>
          <div className="pt-4 flex items-center">
            <h2 className="m-0 text-muted flex-grow">{activatedSoft}</h2>
            <div className="ml-3 small-circle bg-green text-white">
              <Icon className="small-icon">expand_less</Icon>
            </div>
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} md={12}>
        <Card elevation={3} className="p-4">
          <div className="flex items-center">
            <Fab
              size="medium"
              className="bg-light-error circle-44 box-shadow-none overflow-hidden"
            >
              <Icon className="text-error">star_outline</Icon>
            </Fab>
            <h5 className="font-medium text-error m-0 ml-3">Todays rest API Traffic</h5>
          </div>
          <div className="pt-4 flex items-center">
            <h2 className="m-0 text-muted flex-grow">{restApiTraffic}</h2>
            <div className="ml-3 small-circle bg-error text-white">
              <Icon className="small-icon">expand_less</Icon>
            </div>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
