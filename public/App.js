class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList {
        id category name
        price image
      }
    }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const body = await response.text();
    const result = await JSON.parse(body);
    let results = result.data.productList;
    this.setState({
      products: results
    });
  }

  async addProduct(product) {
    const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;
    await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });
    this.loadData();
  }

  render() {
    return React.createElement("div", null, React.createElement(ProductTable, {
      products: this.state.products
    }), React.createElement(ProductAdd, {
      addProduct: product => this.addProduct(product)
    }));
  }

}

function ProductTable({
  products
}) {
  const selectOptions = ["Product Name", "Price", "Category", "Image"];
  return React.createElement(React.Fragment, null, React.createElement("h1", null, "My Company Inventory"), React.createElement("h2", null, "Showing all available products"), React.createElement("hr", null), React.createElement("table", null, React.createElement("thead", null, React.createElement("tr", null, selectOptions.map((option, index) => React.createElement("th", {
    key: index
  }, option)))), React.createElement("tbody", null, products.map((product, index) => React.createElement(ProductRow, {
    product: product,
    index: index,
    key: index
  })))));
}

function ProductRow({
  index,
  product
}) {
  return React.createElement("tr", {
    key: index
  }, React.createElement("th", null, product.name), React.createElement("th", null, "$", product.price), React.createElement("th", null, product.category), React.createElement("th", null, React.createElement("a", {
    href: product.image,
    target: "_blank"
  }, "View")));
}

class ProductAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: '',
      category: '',
      name: '',
      image: ''
    };
  }

  onSubmit(e) {
    e.preventDefault();
    const product = {
      name: this.state.name,
      price: parseInt(this.state.price),
      category: this.state.category,
      image: this.state.image
    };
    this.props.addProduct(product);
    this.setState({
      name: '',
      price: '',
      category: '',
      image: ''
    });
  }

  render() {
    const categoryValues = ["", "Shirts", "Jeans", "Jackets", "Sweaters", "Accessories"];
    return React.createElement(React.Fragment, null, React.createElement("p", null, "Add a new product to Inventory"), React.createElement("hr", null), React.createElement("form", null, "Category ", React.createElement("br", null), React.createElement("select", {
      name: "category",
      value: this.state.category,
      onChange: e => this.setState({
        category: e.target.value
      })
    }, categoryValues.map((value, index) => React.createElement("option", {
      value: value,
      key: index
    }, value))), React.createElement("br", null), "Product Name ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      value: this.state.name,
      name: "name",
      onChange: e => this.setState({
        name: e.target.value
      })
    }), React.createElement("br", null), "Price Per Unit ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "price",
      value: `$${this.state.price}`,
      onChange: e => this.setState({
        price: e.target.value.replace(/\$/g, '')
      })
    }), React.createElement("br", null), "Image URL ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "image",
      value: this.state.image,
      onChange: e => this.setState({
        image: e.target.value
      })
    }), React.createElement("br", null), React.createElement("input", {
      type: "submit",
      value: "Add Product",
      onClick: e => this.onSubmit(e)
    })));
  }

}

const element = React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('root'));