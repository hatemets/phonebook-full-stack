const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")

const app = express()
const port = process.env.PORT || 3001

const people = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

// Middleware
app.use(cors())
app.use(express.json())

morgan.token("body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :body"))

app.use(express.static("build"))


// GET
app.get("/api/persons", (req, res) => {
    res.json(people)
})

app.get("/info", (req, res) => {
    let content = `<p>Phonebook has info about ${people.length} people<p>`
    content += `<p>${Date()}</p>`

    res.send(content)
})

app.get("/api/persons/:id", (req, res) => {
    const person = people.find(p => p.id === Number(req.params.id))
    res.status(404).send(person ? person : `User with id ${req.params.id} not found`)
})


// DELETE
app.delete("/api/persons/:id", (req, res) => {
    const person = people.find(person => person.id === Number(req.params.id))

    if (person) {
        // Remove the person from the array
        people.splice(people.indexOf(person), 1)
        res.send(`Person with id ${req.params.id} deleted successfully!`)
    }
    else {
        res.status(404)
        res.send(`There does not exist a person with id ${req.params.id}`)
    }
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
