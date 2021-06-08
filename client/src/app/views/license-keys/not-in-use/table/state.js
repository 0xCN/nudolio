export const state = {
  open: false,
  openGenerate: false,
  openAssign: false,
  row: {},
  perPage: 10,
  search: '',
  selector: 'key',
  mobile: false,
  selectedRows: [],
  deletedRows: []
};

export const mapStateToProps = state => ({
  token: state.user.token,
  pending: state.keys.pending,
  error: state.keys.error,
  data: state.keys.docs,
  loading: state.keys.pending,
  totalRows: state.keys.totalDocs,
  page: state.keys.page,
  products: state.products.products
});