class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {products: []};
    }

    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        const query = `query {
      productList {
        id category name
        price image
      }
    }`

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        })
        const body = await response.text()
        const result = await JSON.parse(body)
        let results = result.data.productList
        this.setState({products: results});
    }

    async addProduct(product) {
        const query = `mutation productAdd($product: ProductInputs!) {
      productAdd(product: $product) {
        id
      }
    }`;

        await fetch('/graphql', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query, variables: {product}})
        });

        this.loadData();
    }

    render() {
        return (
            <div>
                <ProductTable products={this.state.products}/>
                <ProductAdd addProduct={(product) => this.addProduct(product)}/>
            </div>
        )
    }
}

function ProductTable({products}) {
    const selectOptions = ["Product Name", "Price", "Category", "Image"];

    return (
        <React.Fragment>
            <h1>My Company Inventory</h1>
            <h2>Showing all available products</h2>
            <hr/>
            <table>
                <thead>
                <tr>
                    {selectOptions.map((option, index) => <th key={index}>{option}</th>)}
                </tr>
                </thead>
                <tbody>
                {products.map((product, index) => <ProductRow product={product} index={index} key={index}/>)}
                </tbody>
            </table>
        </React.Fragment>
    )
}

function ProductRow({index, product}) {
    return (
        <tr key={index}>
            <th>{product.name}</th>
            <th>${product.price}</th>
            <th>{product.category}</th>
            <th>
                <a href={product.image} target="_blank">
                    View
                </a>
            </th>
        </tr>
    )
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
        })
    }

    render() {
        const categoryValues = ["", "Shirts", "Jeans", "Jackets", "Sweaters", "Accessories"];
        return (
            <React.Fragment>
                <p>Add a new product to Inventory</p>
                <hr/>
                <form>
                    Category <br/>
                    <select name="category" value={this.state.category}
                            onChange={(e) => this.setState({category: e.target.value})}>
                        {categoryValues.map((value, index) => (
                            <option value={value} key={index}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <br/>
                    Product Name <br/>
                    <input type="text" value={this.state.name} name="name"
                           onChange={(e) => this.setState({name: e.target.value})}/>
                    <br/>
                    Price Per Unit <br/>
                    <input type="text" name="price" value={`$${this.state.price}`}
                           onChange={(e) => this.setState({price: e.target.value.replace(/\$/g, '')})}/>
                    <br/>
                    Image URL <br/>
                    <input type="text" name="image" value={this.state.image}
                           onChange={(e) => this.setState({image: e.target.value})}/>
                    <br/>
                    <input type="submit" value="Add Product" onClick={(e) => this.onSubmit(e)}/>
                </form>
            </React.Fragment>
        )
    }
}


const element = <ProductList/>

ReactDOM.render(element, document.getElementById('root'))