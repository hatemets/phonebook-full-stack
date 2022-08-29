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
app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then(people => {
            res.json(people)
        })
        .catch(err => next(err))
})

app.get("/info", (req, res, next) => {
    let content = ""
    Person
        .find({})
        .then(people => content += `<p>Phonebook has info about ${people.length} people<p>`)
        .then(() => content += `<p>${Date()}</p>`)
        .then(() => res.send(content))
        .catch(err => next(err))
})

app.get("/api/persons/:id", (req, res, next) => {
    Person
        .findById(req.params.id)
        .then(foundPerson => res.json(foundPerson))
        .catch(err => next(err))
})


// DELETE
app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(result)
            res.end()
        })
        .catch(err => next(err))
})


// POST
app.post("/api/persons", (req, res, next) => {
    const { name, number } = req.body

    if (!name || !number) {
        res.status(404).send({ error: "Name and/or number missing" })
    }
    else {
        Person.find({})
            .then(people => {
                if (people.map(person => person.name.toLowerCase()).includes(name.toLowerCase())) {
                    res.status(400).send({ error: "A person with this name already exists" })
                }


            })
            .then(() => {
                const newPerson = new Person({ name, number })
                newPerson
                    .save()
                    .then(result => res.status(201).send(result))
                    .catch(err => next(err))
            })
            .catch(err => next(err))
    }
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" })
}

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    // Error types
    switch (err.name) {
        case "CastError": {
            res.status(400).send({ error: "Invalid MongoDB ID" })
        }
    }

    next(err)
}

// In case no previous handler handles the request
app.use(unknownEndpoint)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
