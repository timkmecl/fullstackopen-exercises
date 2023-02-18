import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../NotificationContext'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()

  const queryClient = useQueryClient()
  
  const newAnecdoteMutation = useMutation(anecdoteService.createNew, {
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    },
    onError: error => {
      dispatch({
        type: 'SET',
        payload: error.response.data.error
      })
      setTimeout(() => {
        dispatch({ type: 'RESET' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({
      content,
      votes: 0
    })
    dispatch({
      type: 'SET',
      payload: `you created ${content}`
    })
    setTimeout(() => {
      dispatch({ type: 'RESET' })
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
