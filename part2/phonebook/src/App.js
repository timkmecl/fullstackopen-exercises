import { useEffect, useState } from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} onSearchNameChange={handleSearchNameChange} />

      <h2>Add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        onNameChange={handleNameChange} 
        onNumberChange={handleNumberChange} 
        addPerson={addPerson} 
      />

      <h2>Numbers</h2>
      <Persons persons={persons} searchName={searchName} />
    </div>
  )
}

export default App