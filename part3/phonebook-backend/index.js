require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



morgan.token('json', (req, res) => {
	return JSON.stringify(req.body)
})

const formatFunction = (tokens, req, res) => {
	let string = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')

	if (req.method === 'POST' || req.method === 'PUT') {
		string += ` ${tokens.json(req, res)}`
	}
	return string
}


const app = express()
app.use(express.json())
app.use(morgan(formatFunction))
app.use(cors())

app.use(express.static('build'))


app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(_ => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
	const body = request.body
	
	if (body.name === undefined) {
		return response.status(400).json({error: 'name missing'})
	}
	if (body.number === undefined) {
		return response.status(400).json({error: 'number missing'})
	}

	const person = new Person({
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(request.params.id, person, {new: true})
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.get('/info', (request, response) => {
	const datetime = new Date()
	Person.countDocuments({}, (err, count) => {
		if (err) {
			console.log(err)
		} else {
			response.end(`<p>Phonebook has info for ${count} people</p>\n<p>${datetime}</p>`);
		}
	})
})


const errorHandler = (error, request, response, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({error: 'malformatted id'})
	}

	next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})