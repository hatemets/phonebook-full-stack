const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("Connecting to", url)

mongoose
    .connect(url)
    .then(result => console.log("Connection established"))
    .catch((err) => console.log(err))


const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set("toJSON", {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
