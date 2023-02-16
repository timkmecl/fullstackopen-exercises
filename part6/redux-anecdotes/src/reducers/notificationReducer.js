import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		setNotificationMessage(state, action) {
			const notification = action.payload
			return notification
		},
		removeNotification(state, action) {
			return initialState
		}
	}
})

export const { setNotificationMessage, removeNotification } = notificationSlice.actions


export const setNotification = (message, time) => {
	return dispatch => {
		dispatch(setNotificationMessage(message))
    setTimeout(() => dispatch(removeNotification()), 1000 * time)
	}
}

export default notificationSlice.reducer