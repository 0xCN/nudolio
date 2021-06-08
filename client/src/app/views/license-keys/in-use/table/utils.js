export const styles = {
  base: {
    textAlign: 'center'
  },
  searchBar: {
    border: '10px',
    display: 'flex',
    width: '600px',
    marginRight: '20px',
    boxShadow: "0px 4px 5px -2px rgb(0 0 0 / 4%), 0px 7px 10px 1px rgb(0 0 0 / 3%), 0px 2px 16px 1px rgb(0 0 0 / 3%)"
  },
  select: {
    padding: '0px',
    height: '49px',
    backgroundColor: 'white',
  },
  topBar: {
    display: 'flex',
    marginBottom: '10px'
  },
  export: {
    backgroundColor: '#7467ef',
    padding: 7,
    color: 'white',
    borderRadius: 4,
    fontSize: 13,
    marginRight: '10px'
  },
  assign: {
    backgroundColor: 'rgba(52, 49, 76, 1)',
    padding: 5,
    color: 'white',
    borderRadius: 4,
    fontSize: 13
  }
}

export const getProdName = (id, P) => {
  for (let i = 0; i < P.length; i++) {
    if (P[i] != null) {
      if (P[i]["_id"] === id) {
        return P[i]["name"];
      }
    }
  }
  return "None";
}

export const getProdId = (name, products) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i] != null && products[i]["name"].toLowerCase() === name.toLowerCase()) {
      return products[i]["_id"];
    }
  }
  return "None"
}