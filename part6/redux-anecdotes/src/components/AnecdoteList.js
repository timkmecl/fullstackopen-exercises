import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
	const anecdotes = useSelector(state => {
		const filteredAnecdotes = state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
		return filteredAnecdotes.sort((a, b) => b.votes - a.votes)
	})
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteFor(id))
    dispatch(setNotification(`you voted ${anecdotes.find(anecdote => anecdote.id === id).content}`))
    setTimeout(() => dispatch(removeNotification()), 5000)
  }

	return (
		<>
		{anecdotes.map(anecdote =>
			<div key={anecdote.id}>
				<div>
					{anecdote.content}
				</div>
				<div>
					has {anecdote.votes}
					<button onClick={() => vote(anecdote.id)}>vote</button>
				</div>
			</div>
		)}
		</>
	)
}

export default AnecdoteList