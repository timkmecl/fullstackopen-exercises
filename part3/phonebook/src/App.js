import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import phonebookService from './services/phonebookService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  const [notification, setNotification] = useState({message: null, color: null})

  
  useEffect(() => {
    phonebookService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    
    const newPerson = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    const showNotification = (message, color) => {
      setNotification({message, color})
      setTimeout(() => {
        setNotification({message: null, color: null})
      }, 5000)
    }

    if (existingPerson) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookService
          .update(existingPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${returnedPerson.name}`, 'green')
          })
          .catch(() => {
            showNotification(`Information of ${newName} has already been removed from server`, 'red')
            setPersons(persons.filter(person => person.name !== newName))
          })
      }
    } else {
      phonebookService
        .create(newPerson)
        .then( returnedPerson => {  
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}`, 'green')
      })
    }
  }

  const deletePerson = (id, name) => {
    if(window.confirm(`Delete ${name}?`)) {
      phonebookService
        .deletePerson(id)
        .then( _ => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
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
      <Notification message={notification.message} color={notification.color} />
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
      <Persons 
        persons={persons} 
        searchName={searchName}
        onDelete={deletePerson}
      />
    </div>
  )
}

export default App