const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

console.log("Connecting to", url)

mongoose
    .connect(url)
    .then(result => console.log("Connection established"))
    .catch(err => console.error(err))

const numValidator = num => {
    const subNums = num.split("-")

    if (subNums.every(el => !isNaN(Number(el)))) {
        if (subNums.length === 2) {
            const res = subNums[0].length >= 2 && num.length - 1 >= 8 && subNums[0].length <= 3
            return res
        }
        else if (subNums.length === 1) {
            return num.length >= 8
        }
        else {
            return false
        }
    }
    else {
        return false
    }
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: [numValidator, "length must be 8+, can be separated with \"-\", but 2-3 numbers in first part"],
        required: true
    }
})

personSchema.set("toJSON", {
    transform: (doc, obj) => {
        obj.id = obj._id.toString()
        delete obj._id
        delete obj.__v
    }
})

module.exports = mongoose.model("Person", personSchema)
