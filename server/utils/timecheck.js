/*
  DO NOT EDIT
*/

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

module.exports = {
  check: (admin) => {
    let now = new Date();
    // Assigning dates (if they have not been assigned already)
    for (const [key, value] of Object.entries(admin.dashboard.sales)) {
      if (!value.start_date) {
        admin.dashboard.sales[key].start_date = now;        
      }
    }
    if (!admin.dashboard.graph.start_date) {
      admin.dashboard.graph.start_date = now;
    }
    if (!admin.dashboard.traffic.date) {
      admin.dashboard.traffic.date = now;
    }
    // TIME CHECKERS (updating the times with every request)
    let weekDate = new Date(admin.dashboard.sales.week.start_date);
    let monthDate = new Date(admin.dashboard.sales.month.start_date);
    let yearDate = new Date(admin.dashboard.sales.year.start_date);
    let requestDate = new Date(admin.dashboard.traffic.date);
    let graphDate = new Date(admin.dashboard.graph.start_date);
    // the dashboard wants to keep track of todays requests
    if (dateDiffInDays(requestDate, now) > 1) {
      admin.dashboard.traffic.requests = 0;
      admin.dashboard.traffic.date = now;
    }
    if (dateDiffInDays(weekDate, now) > 7) {
      admin.dashboard.sales.week.revenue = 0;
      admin.dashboard.sales.week.start_date = now;
    }
    if (monthDate.getMonth() != now.getMonth()) {
      admin.dashboard.sales.month.revenue = 0;
      admin.dashboard.sales.month.start_date = now;
    }
    if (yearDate.getFullYear() != now.getFullYear()) {
      admin.dashboard.sales.year.revenue = 0;
      admin.dashboard.sales.year.start_date = now;
    }
    if (graphDate.getFullYear() != now.getFullYear()) {
      // if it's a new year then delete all graph data for the past year
      Object.keys(admin.dashboard.graph).forEach((key) => {
        if (key != "start_date") {
          admin.dashboard.graph[key] = 0;
        }
      });
    }
    return admin;
  }
}
