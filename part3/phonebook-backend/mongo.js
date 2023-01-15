const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.z5lejvh.mongodb.net/FSOPhonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})
const Person = mongoose.model('Person', personSchema)



mongoose
	.connect(url)
	.then(result => {
		if (process.argv.length < 5) {
			Person.find({}).then(result => {
				console.log('phonebook:')
				result.forEach(person => {
					console.log(`${person.name}, ${person.number}`)
				})
				mongoose.connection.close()
			})

		} else {
			const name = process.argv[3]
			const number = process.argv[4]

			const person = new Person({
				name, number
			})
		
			person.save().then(savedPerson => {
				console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
				mongoose.connection.close()
			})
		}
	})
	.catch(err => console.log(err))