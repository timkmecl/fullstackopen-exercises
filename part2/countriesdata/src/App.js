import {useEffect, useState} from 'react'
import axios from 'axios'

const App = () => {
  
  const [countries, setCountries] = useState([])
  const [searchName, setSearchName] = useState('')
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])


  const countriesToShow = countries.filter(country => 
    country.name.common.toLowerCase().includes(searchName.toLowerCase())
  )

  const selectedCountry = countriesToShow.length === 1 ? countriesToShow[0] : null

  useEffect(() => {
    if (!selectedCountry) return

    const API_key = process.env.REACT_APP_API_KEY
    const lat = selectedCountry.capitalInfo.latlng[0]
    const lon = selectedCountry.capitalInfo.latlng[1]
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`)
      .then(response => {
        console.log(response.data)
        setWeatherData(response.data)
      })

    console.log(selectedCountry)
  }, [selectedCountry])


  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value)
  }

  const handleCountrySelect = (selectedName) => {
    setSearchName(selectedName)
  }

  return (
    <div>
      <p>find countries: <input value={searchName} onChange={handleSearchNameChange} /> </p>
      {(countriesToShow.length > 1) && 
        ((countriesToShow.length <= 10) 
        ? countriesToShow.map(country => 
            <p key={country.name.common}>
              {country.name.common} <button onClick={() => handleCountrySelect(country.name.common)}>show</button> 
            </p>
          ) 
        : <p>Too many matches, specify another filter</p>)
      }

      {(countriesToShow.length === 1) &&
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <p>capital {selectedCountry.capital[0]}</p>
          <p>area {selectedCountry.area}</p>
          <h2>languages</h2>
          <ul>
            {Object.values(selectedCountry.languages).map(language =>
              <li key={language}>{language}</li>
            )}
          </ul>
          <img src={selectedCountry.flags.png} width="150" />
          
          {weatherData &&
          <div>
            <h2>Weather in {selectedCountry.capital[0]}</h2>
            <p>temperature: {(weatherData.main.temp - 273).toFixed(1)} Celsius</p>
            <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} />
            <p>wind {weatherData.wind.speed} m/s</p>
          </div>}
        </div>
      }
    </div>
  )
}

export default App;
