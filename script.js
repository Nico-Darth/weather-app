const apiKey = 'e894b508a1edc8dbeb837f20462bd1dd';
const weatherResult = document.getElementById('weatherResult');
const temperatureText = document.getElementById('temperature');
const statusText = document.getElementById('status');
const tempSwitch = document.getElementById('tempSwitch');
const warningMessage = document.getElementById('warningMessage');

const randomPhrases = [
    "Misschien een andere stad proberen?",
    "Laten we even op de kaart kijken...",
    "Deze stad bestaat niet op 'deze' aarde...",
    "Probeer een stad met een andere spelling.",
    "Het lijkt erop dat deze stad niet bestaat.",
    "Misschien is het tijd voor een roadtrip!",
    "Soms zijn steden moeilijk te vinden.",
    "Probeer het eens met een andere naam.",
    "Zou je die stad echt willen bezoeken?",
    "Hou je de kaart verkeerd om?"
];

document.getElementById('getWeather').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        const data = await response.json();

        // Reset de temperatuur- en status elementen voor animatie
        temperatureText.classList.remove('show');
        statusText.classList.remove('show');
        warningMessage.classList.add('d-none'); // Verberg waarschuwing in het begin

        if (data.cod === 200) {
            const temperatureCelsius = Math.round(data.main.temp);
            const weatherDescription = data.weather[0].description;
            const emoji = getEmoji(weatherDescription);
            
            let temperature = temperatureCelsius;
            let unit = "°C";
            if (tempSwitch.checked) {
                temperature = Math.round((temperatureCelsius * 9/5) + 32); // Celsius naar Fahrenheit
                unit = "°F";
            }

            temperatureText.innerText = `Temperatuur: ${temperature}${unit}`;
            statusText.innerText = `Weerstatus: ${weatherDescription} ${emoji}`;
            
            // Toon waarschuwingen
            showWarning(temperatureCelsius, weatherDescription);
            
            // Toon het weerresultaat met een animatie
            weatherResult.classList.add('show');
            weatherResult.classList.remove('d-none');

            // Voeg animatie toe aan temperatuur en status
            setTimeout(() => {
                temperatureText.classList.add('show');
                statusText.classList.add('show');
            }, 100); 
        } else {
            const randomIndex = Math.floor(Math.random() * randomPhrases.length);
            const randomPhrase = randomPhrases[randomIndex];
            temperatureText.innerText = '';
            statusText.innerText = `Stad niet gevonden. ${randomPhrase}`;
            warningMessage.classList.add('d-none'); 
            weatherResult.classList.add('show');
            weatherResult.classList.remove('d-none');

            // Voeg animatie toe aan temperatuur en status
            setTimeout(() => {
                statusText.classList.add('show');
            }, 100); 
        }
    }
});

// Functie om waarschuwingen weer te geven
function showWarning(temperature, weatherDescription) {
    let warning = '';
    
    if (temperature >= 30) {
        warning = '🚨 Let op! Het is erg heet buiten! Blijf gehydrateerd!';
    } else if (temperature <= 0) {
        warning = '🥶 Het is erg koud! Draag warme kleding!';
    } else if (weatherDescription.includes('rain') && (weatherDescription.includes('heavy') || weatherDescription.includes('light'))) {
        warning = '🌧️ Er is regen verwacht. Neem een paraplu mee!';
    }
    
    if (warning) {
        warningMessage.innerText = warning;
        warningMessage.classList.remove('d-none'); // Toon de waarschuwing

        // Verberg de waarschuwing na 5 seconden
        setTimeout(() => {
            warningMessage.classList.add('d-none');
        }, 5000);
    }
}

function getEmoji(description) {
    if (description.includes('clear')) {
        return '☀️';
    } else if (description.includes('cloud')) {
        return '☁️';
    } else if (description.includes('rain')) {
        return '🌧️';
    } else if (description.includes('snow')) {
        return '❄️';
    } else if (description.includes('thunderstorm')) {
        return '⛈️';
    } else {
        return '🌈'; // Voor andere weersomstandigheden
    }
}
