const mongoose = require('mongoose')




const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.y4w4gix.mongodb.net/phonebook?retryWrites=true&w=majority`

const personsSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('Person', personsSchema)


mongoose
  .connect(url)
  if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }
  if (process.argv.length === 3){
      Person.find({}).then((result) => {
      console.log('phonebook:')
      result.forEach((person) => console.log(person.name, person.number))
      mongoose.connection.close()
      })
  }
  if (process.argv.length == 4){
    console.log('Please provide name and phone number arguments!')
    process.exit(1)
  }
  if (process.argv.length == 5){
    console.log('connected')

    const person = new Person({
        name: name,
        number: number,
    })

    return person.save()
  
  .then(() => {
    console.log('Person saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
}
