import { promises as fs } from 'fs';

const citiesAndStatesTabulation = [];
let allCitiesAndStates = null;
let allStatesAndRespectiveCities = [];
let allCities = [];
let allStates = [];

//----------------------------------------------------------
async function writeJsonFiles() {
  try {
    allStates = JSON.parse(await fs.readFile('Estados.json'));
    allCities = JSON.parse(await fs.readFile('Cidades.json'));
    allStatesAndRespectiveCities = [];
    // console.log(allStatesAndRespectiveCities);
    allStates.forEach((state) => {
      const selectedCities = allCities.filter(
        (city) => city.Estado === state.ID
      );
      allStatesAndRespectiveCities.push({
        ...state,
        selectedCities,
      });
    });
    fs.writeFile(
      'TodasAsCidadesEEstados.json',
      JSON.stringify(allStatesAndRespectiveCities)
    );
    allStatesAndRespectiveCities.forEach((state) => {
      fs.writeFile(state.Sigla + '.json', JSON.stringify(state));
    });
  } catch (err) {
    console.log(err);
  }
}
//----------------------------------------------------------
async function countCities(uf) {
  const state = JSON.parse(await fs.readFile(uf + '.json'));
  return state.selectedCities.length;
}

//----------------------------------------------------------
async function citiesTabulation() {
  try {
    allCitiesAndStates = JSON.parse(
      await fs.readFile('TodasAsCidadesEEstados.json')
    );
    allCitiesAndStates.forEach(async (state) => {
      try {
        let cities = await countCities(state.Sigla);
        citiesAndStatesTabulation.push({
          state: state.Sigla,
          cidades: cities,
        });
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
//----------------------------------------------------------
function top5(top5) {
  setTimeout(() => {
    const top5Tabulated = top5.sort((a, b) => b.cidades - a.cidades);
    console.log('Top 5\n', top5Tabulated.slice(0, 5));
  }, 1500);
}
//----------------------------------------------------------
function bottom5(bottom5) {
  setTimeout(() => {
    const bottom5Tabulated = bottom5.sort((a, b) => b.cidades - a.cidades);
    console.log('Bottom 5\n', bottom5Tabulated.slice(22, 27));
  }, 1500);
}
//----------------------------------------------------------
function biggestCitiesForEachState() {
  setTimeout(() => {
    console.log('Maiores nomes de cidades por Estado\n');
    allCitiesAndStates.forEach((state) => {
      state.selectedCities.sort((a, b) => b.Nome.length - a.Nome.length);
      console.log(`${state.selectedCities[0].Nome}-${state.Sigla}`);
    });
  }, 3000);
}
//----------------------------------------------------------
function biggestCityAmongStates() {
  let biggestNames = [];
  setTimeout(() => {
    allCitiesAndStates.map((state) => {
      state.selectedCities.sort((a, b) => b.Nome.length - a.Nome.length);
      biggestNames.push({
        cidade: state.selectedCities[0].Nome,
        estado: state.Sigla,
      });
      biggestNames.sort((a, b) => b.cidade.length - a.cidade.length);
    });
    console.log(
      `Maior Nome: ${biggestNames[0].cidade}-${biggestNames[0].estado}`
    );
  }, 3000);
}
//----------------------------------------------------------
function smallesttCityAmongStates() {
  let smallestNames = [];
  setTimeout(() => {
    allCitiesAndStates.map((state) => {
      state.selectedCities.sort((a, b) => a.Nome.length - b.Nome.length);
      smallestNames.push({
        cidade: state.selectedCities[0].Nome,
        estado: state.Sigla,
      });
    });
    smallestNames.sort((a, b) => {
      if (a.cidade > b.cidade) {
        return 1;
      }
      if (a.cidade < b.cidade) {
        return -1;
      }
      return 0;
    });
    smallestNames.forEach(name => console.log(`${name.cidade}-${name.estado}`))
    smallestNames.sort((a, b) => a.cidade.length - b.cidade.length);
    console.log(
      `Menor Nome: ${smallestNames[0].cidade}-${smallestNames[0].estado}`
    );
  }, 3000);
}
//----------------------------------------------------------

// writeJsonFiles();
countCities('PE');
citiesTabulation();
top5(citiesAndStatesTabulation);
bottom5(citiesAndStatesTabulation);
biggestCitiesForEachState();
biggestCityAmongStates();
smallesttCityAmongStates();
