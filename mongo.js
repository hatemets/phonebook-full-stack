const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1)
}

const [password, name, number] = [...process.argv].splice(2)

const url = `mongodb+srv://admin:${password}@evently-test.hat3d.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

mongoose
    .connect(url)
    .then(result => {
        console.log("Connection established")

        if (process.argv.length === 5) {
            const person = new Person({
                name,
                number
            })

            console.log("Person added")
            person.save()
            mongoose.connection.close()
        }
        else if (process.argv.length === 3) {
            Person.find({}).then(res => {
                console.log("Phonebook:")
                res.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                mongoose.connection.close()
            })
        }
        else {
            console.error("Unknown number of parameters: ", process.argv.length)
        }
    })
    // .then(() => mongoose.connection.close())
    .catch((err) => console.log(err))
