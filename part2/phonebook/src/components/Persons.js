
const Persons = ({persons, searchName}) => {

	const personsToShow = persons.filter(person => person.name.toLowerCase().startsWith(searchName.toLowerCase()))

	return (
		<div>
			{personsToShow.map((person) => (
				<p key={person.name}>{person.name} {person.number}</p>
			))}
		</div>
	)
}

export default Persons