export const state = {
  open: false,
  openDetails: false,
  row: {},
  perPage: 10,
  search: '',
  selector: 'key',
  mobile: false,
  selectedRow: []
};

export const mapStateToProps = state => ({
  token: state.user.token,
  pending: state.assigned_keys.pending,
  error: state.assigned_keys.error,
  data: state.assigned_keys.docs,
  loading: state.assigned_keys.pending,
  totalRows: state.assigned_keys.totalDocs,
  page: state.assigned_keys.page,
  products: state.products.products
});