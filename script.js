const modal = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal-container');
const modalClose = document.querySelectorAll('.close-button');

//getting the API key with a fetch
async function getApiKey() {
  try {
    const resp = await fetch(
      'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys',
      {
        method: 'POST',
      }
    );
    const data = await resp.json();
    return data.key;
  } catch (error) {
    console.error('Error fetching the API KEY', error);
  }
}

//getting the planets info with a fetch
async function getPlanets() {
  const key = await getApiKey();
  try {
    const resp = await fetch(
      'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies',
      {
        headers: {
          'x-zocom': `${key}`,
        },
      }
    );
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error('Error fetching the planets', error);
  }
}
//Looking through the Array of the API and send it to HTML
async function displayPlanetInfo(planetId) {
  try {
    const response = await getPlanets();
    const planetsData = response.bodies;
    let clickedPlanet = null;

    for (let i = 0; i < planetsData.length; i++) {
      if (planetsData[i].name.toLowerCase() === planetId) {
        clickedPlanet = planetsData[i];
        break;
      }
    }
    // All the HTML class/elements changed to API information
    if (clickedPlanet) {
      document.querySelector('.planet-name h2').innerHTML = clickedPlanet.name;
      document.querySelector('.planet-name-latin h3').innerHTML =
        clickedPlanet.latinName;
      document.querySelector('.planet-description p').innerHTML =
        clickedPlanet.desc;
      document.querySelector('.circumference p').innerHTML =
        clickedPlanet.circumference + ' km';
      document.querySelector('.distance p').innerHTML =
        clickedPlanet.distance + ' km';
      document.querySelector('.max-temp p').innerHTML =
        clickedPlanet.temp.day + ' C';
      document.querySelector('.min-temp p').innerHTML =
        clickedPlanet.temp.night + ' C';
      document.querySelector('.moons ul').innerHTML = clickedPlanet.moons;

      modal.showModal();
      modalClose.forEach((btn) =>
        btn.addEventListener('click', function () {
          modal.close();
        })
      );
    }
  } catch (error) {
    console.error('Problem fetching the clicked planet data');
  }
}

// The clicked planet, makes a window appear with info "modal" HTML används av (Dialog)
document.addEventListener('DOMContentLoaded', () => {
  const planets = document.querySelectorAll('.planet');
  for (let i = 0; i < planets.length; i++) {
    planets[i].addEventListener('click', (event) => {
      const planetId = event.currentTarget.id;
      displayPlanetInfo(planetId);
    });
  }
});

// let myPlanet = planetsData.find(
//   (planet) => planet.name.toLowerCase() == planetId
// );
// for (let planet of planets) {
//   planet.addEventListener('click', (event) => {
//     const planetId = event.currentTarget.id;
//     displayPlanetInfo(planetId);
//   });
// }
