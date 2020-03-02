const express = require('express')
const fs = require('fs')
const {ApolloServer} = require('apollo-server-express')

const app = express()
const mockProducts = []

const resolvers = {
    Query: {
        productList
    },
    Mutation: {
        productAdd
    }
}

function productList() {
    return mockProducts
}

function productAdd(_, {product}) {
    product.id = mockProducts.length + 1
    mockProducts.push(product)

    return product
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers
})

app.use(express.static('public'))

server.applyMiddleware({app, path: '/graphql'})

app.listen(3000, function () {
    console.log('App started on port 3000')
})
