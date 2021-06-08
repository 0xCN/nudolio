import React from "react";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import { Button, Toolbar, AppBar } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Footer = ({ theme, settings }) => {
  const footerTheme = settings.themes[settings.footer.theme] || theme;
  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar color="primary" position="static">
        <Toolbar className="footer flex items-center">
          <div className="flex items-center container w-full">
            <a
              href="https://ui-lib.com/downloads/matx-react-material-design-admin-template/"
              className="mr-2"
            >
              <Button variant="contained">Contact</Button>
            </a>
            <a href="https://ui-lib.com/downloads/matx-pro-react-material-design-admin-template/">
              <Button variant="contained" color="secondary">
                GitHub
              </Button>
            </a>
            <span className="m-auto"></span>
            <p className="m-0">
              Developed by <a href="https://github.com/0xcn">0xCN</a>
            </p>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

Footer.propTypes = {
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  settings: state.layout.settings
});

export default withStyles(
  {},
  { withTheme: true }
)(connect(mapStateToProps, {})(Footer));
