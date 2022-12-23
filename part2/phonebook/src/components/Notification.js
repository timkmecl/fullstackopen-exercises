
const Notification = ({ message, color }) => {
	if  (message === null) {
		return null
	}

	return (
		<div className="notification" style={{color: color}}>
			{message}
		</div>
	)
}

export default Notification