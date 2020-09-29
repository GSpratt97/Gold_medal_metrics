var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  return `CREATE TABLE Country (
            name TEXT NOT NULL, 
            code TEXT NOT NULL, 
            gdp INTEGER, 
            population INTEGER
          );`;
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  return `CREATE TABLE GoldMedal (
              id INTEGER PRIMARY KEY, 
              year INTEGER NOT NULL, 
              city TEXT NOT NULL, 
              season TEXT NOT NULL, 
              name TEXT NOT NULL, 
              country TEXT NOT NULL, 
              gender TEXT NOT NULL, 
              sport TEXT NOT NULL, 
              discipline TEXT NOT NULL, 
              event TEXT NOT NULL
            );`;
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = (country) => {
    return `SELECT COUNT(*) 
            FROM GoldMedal 
            WHERE country = '${country}';`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = country => {
  return `WITH temporary_year AS (
            SELECT year, COUNT(*) AS 'count'
            FROM GoldMedal
            WHERE country = '${country}' AND season = 'Summer'
            GROUP BY year 
          )
          SELECT year, MAX(count) AS count
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
 
  return `WITH temporary_year AS (
            SELECT year, COUNT(*) AS 'count'
            FROM GoldMedal
            WHERE country = '${country}' AND season = 'Winter'
            GROUP BY year 
          )
          SELECT year, MAX(count) AS count
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestYear = country => {
  return `WITH temporary_year AS (
            SELECT year, COUNT(*) AS 'count'
            FROM GoldMedal
            WHERE country = '${country}'
            GROUP BY year 
          )
          SELECT year, MAX(count) AS count
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the discipline this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
  return `WITH temporary_year AS (
            SELECT discipline, COUNT(*) AS 'count'
            FROM GoldMedal
            WHERE country = '${country}'
            GROUP BY discipline
          )
          SELECT MAX(count) AS count, discipline
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the sport this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
  return `WITH temporary_year AS (
            SELECT sport, COUNT(*) AS 'count'
            FROM GoldMedal
            WHERE country = '${country}'
            GROUP BY sport
          )
          SELECT MAX(count) AS count, sport
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the event this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  return `WITH temporary_year AS (
            SELECT event, COUNT(*) AS 'count'
            FROM GoldMedal
            WHERE country = '${country}'
            GROUP BY event
          )
          SELECT MAX(count) AS count, event
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const numberMenMedalists = country => {
  return `WITH temporary_year AS (
              SELECT  COUNT(*) AS 'count'
              FROM GoldMedal
              WHERE country = '${country}'  AND gender = 'Men'
              GROUP BY name
          )
          SELECT COUNT(count) AS count 
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  return `WITH temporary_year AS (
              SELECT  COUNT(*) AS 'count'
              FROM GoldMedal
              WHERE country = '${country}'  AND gender = 'Women'
              GROUP BY name
          )
          SELECT COUNT(count) AS count 
          FROM temporary_year;`;
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
  return `SELECT name, COUNT(name) AS 'count'
          FROM GoldMedal
          WHERE country = '${country}'
          GROUP BY name
          ORDER BY count DESC
          LIMIT 1;`;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
  let direction = '';
  if (field) {
    if (sortAscending) {
      direction = `ORDER BY ${field} ASC`
    } else {
      direction = `ORDER BY ${field} DESC`
    }
  }
      
  return `SELECT *
          FROM GoldMedal
          WHERE country = '${country}'
          ${direction};`;
  
};

/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  let direction = '';
  if (field) {
    if (sortAscending) {
      direction = `ORDER BY ${field} ASC`
    } else {
      direction = `ORDER BY ${field} DESC`
    }
  }  
  
  return `SELECT sport, COUNT(sport) AS count, (COUNT(sport) * 100 / (
            SELECT COUNT(*) 
            FROM GoldMedal 
            WHERE country = '${country}')) AS percent 
          FROM GoldMedal WHERE country = '${country}' 
          GROUP BY sport 
          ${direction};`;

};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
