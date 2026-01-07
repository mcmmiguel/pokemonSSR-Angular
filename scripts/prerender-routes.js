const TOTAL_POKEMONS = 151;
const TOTAL_PAGES = 10;
(async () => {
  const fs = require("fs");

  const pokemonIds = Array.from({ length: TOTAL_POKEMONS }, (_, i) => i + 1);
  const pokemonPages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  const pokemonNames = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=20"
  ).then((res) => res.json());

  let pokemonsContent = pokemonIds.map((id) => `/pokemons/${id}`).join("\n");
  let pageContent = pokemonPages
    .map((page) => `/pokemons/page/${page}`)
    .join("\n");

  let fileContent = pokemonsContent.concat("\n").concat(pageContent);
  fileContent += "\n";
  fileContent += pokemonNames.results
    .map((pokemon) => `/pokemons/${pokemon.name}`)
    .join("\n");
  console.log(pokemonIds);

  fs.writeFileSync("routes.txt", fileContent);
  console.log("Routes.txt Generated");
})();
