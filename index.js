const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
require("dotenv").config()
const Person = require("./models/person")


const app = express()
const port = process.env.PORT || 3001

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    // Error types
    switch (err.name) {
        case "CastError": {
            res.status(400).send({ error: "Invalid MongoDB ID" })
        }
        case "MissingInput": {
            res.status(404).send({ error: "Input missing" })
        }
        case "ValidationError": {
            res.status(400).json({ error: err.message })
        }
    }

    next(err)
}

// Middleware
app.use(express.static("build"))
app.use(express.json())

const requestLogger = morgan((tokens, req, res) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens["response-time"](req, res), "ms",
    JSON.stringify(req.body)
].join(" "))

app.use(requestLogger)
app.use(cors())

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
            const status = (result) ? 204 : 404
            res.status(status).end()
        })
        .catch(err => next(err))
})


// POST
app.post("/api/persons", (req, res, next) => {
    const { name, number } = req.body
    const person = new Person({ name, number })

    person.save()
        .then(p => res.json(p))
        .catch(err => next(err))
})

// PUT
app.put("/api/persons/:id", (req, res, next) => {
    const { name, number } = req.body

    const updatedPerson = { name, number }

    Person
        .findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" })
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})
