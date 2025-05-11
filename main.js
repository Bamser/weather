const cityInput = document.querySelector('#cityInput')
const weatherButton = document.querySelector('#weatherButton')
const clearButton = document.querySelector('#clearButton')
const result = document.querySelector('#result')

function getWeather(city) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
    )
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Такого города не существует!')
        }
      })
      .then((json) =>
        resolve({
          text: `${json.name}: ${json.main.temp}°C, ${json.weather[0].description}`,
          condition: json.weather[0].main,
        })
      )
      .catch((error) => reject(error))
  })
}

async function fetchWeather(city) {
  try {
    const res = await getWeather(city)

    switch (res.condition) {
      case 'Clear':
        document.body.style.background = '#f5e77b'
        break
      case 'Clouds':
        document.body.style.background = '#c9c9c6'
        break
      case 'Rain':
        document.body.style.background = '#47a2d6'
        break
      case 'Snow':
        document.body.style.background = '#fff'
        break
      default:
        document.body.style.background = '#aedef2'
        break
    }

    result.classList.remove('loading')
    result.textContent = res.text
    result.classList.add('borderGreen')
  } catch (error) {
    result.classList.remove('loading')
    result.textContent = 'Ошибка: ' + error
    document.body.style.background = '#aedef2'
    result.classList.add('borderRed')
  }
}
weatherButton.addEventListener('click', () => {
  let city = cityInput.value.trim()
  if (city != '') {
    result.textContent = 'Loading'
    result.classList.add('loading')
    result.classList.remove('borderGreen', 'borderRed')
    fetchWeather(city)
  } else {
    result.textContent = 'Введите город!'
    result.classList.add('borderRed')
    document.body.style.background = '#aedef2'
    result.classList.remove('loading')
  }
})

clearButton.addEventListener('click', () => {
  result.classList.remove('borderGreen', 'borderRed', 'loading')
  result.textContent = ''
  cityInput.value = ''
  document.body.style.background = '#aedef2'
  cityInput.focus()
})

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') weatherButton.click()
})
