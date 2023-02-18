import { useReducer, useContext, createContext } from 'react'

const initialState = ''

const notificationReducer = (state, action) => {
	switch (action.type) {
		case 'SET':
			return action.payload
		case 'RESET':
			return initialState
		default:
			return state
	}
}


const NotificationContext = createContext()

const NotificationContextProvider = (props) => {
	const [notification, notificationDispatch] = useReducer(notificationReducer, initialState)

	return (
		<NotificationContext.Provider value={[notification, notificationDispatch]}>
			{props.children}
		</NotificationContext.Provider>
	)
}


export const useNotificationValue = () => {
	const context = useContext(NotificationContext)
	return context[0]
}

export const useNotificationDispatch = () => {
	const context = useContext(NotificationContext)
	return context[1]
}

export default NotificationContextProvider