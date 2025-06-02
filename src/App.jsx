import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notifications from './components/Notifications'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const showMessage = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} ya está en la agenda, ¿deseas reemplazar el número?`
      )
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returned => {
            setPersons(persons.map(p => p.id !== returned.id ? p : returned))
            showMessage(`Número actualizado para ${returned.name}`)
            setNewName('') // limpiar campo nombre
            setNewNumber('') // limpiar campo número
          })
          .catch(error => {
            showMessage(`La persona '${newName}' ya fue eliminada del servidor`, 'error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(added => {
          setPersons(persons.concat(added))
          showMessage(`Agregado ${added.name}`)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`¿Eliminar a ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Eliminado ${name}`)
        })
        .catch(error => {
          showMessage(`No se pudo eliminar a ${name}`, 'error')
        })
    }
  }

  return (
    <div>
      <h2>Agenda Telefónica</h2>
      <Notifications message={notification} />
      <form onSubmit={handleSubmit}>
        <div>
          nombre: <input value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          número: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
        </div>
        <div>
          <button type="submit">Agregar</button>
        </div>
      </form>
      <h3>Números</h3>
      <ul>
        {persons.map(person =>
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>Eliminar</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
