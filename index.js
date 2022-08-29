const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
require("dotenv").config()
const Person = require("./models/person")


const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

morgan.token("body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :body"))

app.use(express.static("build"))


// GET
app.get("/api/persons", (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get("/info", (req, res) => {
    let content = `<p>Phonebook has info about ${people.length} people<p>`
    content += `<p>${Date()}</p>`

    res.send(content)
})

app.get("/api/persons/:id", (req, res) => {
    const person = people.find(p => p.id === Number(req.params.id))

    Person
        .findById(req.params.id)
        .then(foundPerson => {
            res.json(foundPerson)
        })
        .catch(err => res.status(404).send(person ? person : `User with id ${req.params.id} not found`))
})


// DELETE
app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(result)
            res.end()
        })
        .catch(err => console.error(err))
})


// POST
app.post("/api/persons", (req, res) => {
    const { name, number } = req.body

    if (!name || !number) {
        res.status(404).send("Name and/or number missing")
    }
    else if (people.map(person => person.name.toLowerCase()).includes(name.toLowerCase())) {
        res.status(400).send("A person with this name already exists")
    }
    else {
        // Id is a random number between 0 and 10000
        const newPerson = { name, number, id: Math.floor(Math.random() * Math.pow(10, 4)) }
        people.push(newPerson)
        res.status(201).send(newPerson)
    }
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" })
}

// In case no previous handler handles the request
app.use(unknownEndpoint)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
