const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())

let persons = 
    [
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

    morgan.token("requests", function (req) {
      return JSON.stringify(req.body)
    })
    
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms :requests"))

    const generateId = () => {
      const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
      return maxId + 1
    }

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    console.log("In info");
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const date = new Date()
        const year = new Date().getFullYear()
        const time = date.toLocaleTimeString()

        var dayName = days[date.getDay()];
        const month = date.toLocaleString('en-US', {month: 'short'});


    console.log(dayName, month, date.getDate(), year, time);
    response.send(`<p>Phonebook has info for ${persons.length} people. Current time: ${dayName} ${month} ${date.getDate()} ${year} ${time}</p>`)
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
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'No person to add!' 
      })
    }

    if (!body.name){
      return response.status(400).json({ 
        error: 'Name missing!' 
      })
    }

    if (!body.number){
      return response.status(400).json({ 
        error: 'Number missing!' 
      })
    }

    if (persons.find(person => person.name === body.name)){
      return response.status(400).json({ 
        error: 'Name must be unique!' 
      })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })