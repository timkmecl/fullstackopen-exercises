import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    changeAnecdote(state, action) {
      const changedAnecdote = action.payload
      return state.map(anecdote => 
        anecdote.id !== changedAnecdote.id ? anecdote : changedAnecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, changeAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteFor = id => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    const anecdoteToChange = anecdotes.find(anecdote => anecdote.id === id)
    const changedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1
    }
    const returnedAnecdote = await anecdoteService.update(id, changedAnecdote)
    dispatch(changeAnecdote(returnedAnecdote))
  }
}

export default anecdoteSlice.reducer