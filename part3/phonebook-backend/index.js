const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


let persons = [
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

	if (req.method === 'POST') {
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
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)

	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

app.post('/api/persons', (request, response) => {
	const person = {
		...request.body,
		id: Math.floor(Math.random() * 1000000000)
	}

	if (!person.name || !person.number) {
		return response.status(400).json({
			error: "Fields missing"
		})
	} else if (persons.some(p => p.name === person.name)) {
		return response.status(400).json({
			error: "This person already exists"
		})
	}

	persons = persons.concat(person)
	response.json(person)
})

app.get('/info', (request, response) => {
	const datetime = new Date()
	const number = persons.length
	response.end(`<p>Phonebook has info for ${number} people</p>\n<p>${datetime}</p>`);
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})