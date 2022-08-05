require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))


    morgan.token("requests", function (req) {
      return JSON.stringify(req.body)
    })
    
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms :requests"))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>{
      response.json(persons)
    })
  })

  app.get('/info', (request, response) => {
    console.log("In info");
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const date = new Date()
        const year = new Date().getFullYear()
        const time = date.toLocaleTimeString()

        var dayName = days[date.getDay()];
        const month = date.toLocaleString('en-US', {month: 'short'});
        Person.find({}).then(persons => {
          console.log(dayName, month, date.getDate(), year, time);
          response.send(`<p>Phonebook has info for ${persons.length} people. Current time: ${dayName} ${month} ${date.getDate()} ${year} ${time}</p>`)
        })
  })

  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person =>{
      if (person){
        response.json(person)
      }
      else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

  
    Person.findByIdAndUpdate(request.params.id, {name, number}, { new: true , runValidators: true, context: 'query'})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body === undefined){
      return response.status(400).json({error: 'Content missing!'})
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

    const person = new Person({
        name: body.name,
        number: body.number
        })

    person.save()
    .then(savedPerson =>  savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        response.json(savedAndFormattedPerson)
        })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Bad id!' })
  } 
  else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })