// on veut créer un serveur web on va prendre express
const express = require("express");
// on récupère les fonctions pour obtenir date et heure d'un fuseau particulier
const { getCurrentDate, getCurrentTime } = require("./my_modules/timezone");
const capitalCities = require("./my_modules/capitalCities");

const app = express();
const port = 4000;

// Configurer le moteur de templates EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// mise enplace d'un dossier pour servir les assets statiques
app.use(express.static("./public"));

app.get("/", (request, response) => {
  // on renvoie le fichier index.html
  response.render('index', { capitalCities });
});

app.get("/city/:cityName", (request, response) => {
  // on récupère le nom de la ville
  const cityName = request.params.cityName;
  // on recherche dans le tableau capitalCities l'objet dont la propriété name (converti en minuscules)
  // est égale au nom de la ville reçu via la requête
  const foundCity = capitalCities.find(
    city => city.name.toLowerCase() === cityName
  );

  // si aucune ville n'est trouvé, foundCity sera undefined
  if (!foundCity) {
    // on renvoie une réponse avec un statusCode de 404
    return res.status(404).render('404');
  }

  // si une ville est trouvée on renvoie une pagfe html avec la date et l'heure sous le fuseau correspondant
  const date = getCurrentDate(foundCity.tz);
  const time = getCurrentTime(foundCity.tz);

  response.render('city', { city: foundCity, date, time });
});

app.listen(port, () => {
  console.log(`🚀 Server ready : http://localhost:${port}`);
});
