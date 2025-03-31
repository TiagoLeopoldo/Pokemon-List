const pokeApi = {};

// Função para converter os detalhes do Pokémon da API para o modelo personalizado
function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id; // Número do Pokémon
  pokemon.name = pokeDetail.name; // Nome do Pokémon

  // Obtém os tipos do Pokémon a partir da API
  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types; // Todos os tipos
  pokemon.type = type; // Tipo principal
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default; // Imagem do Pokémon

  // Adiciona os atributos (stats) ao modelo
  pokemon.stats = pokeDetail.stats.map(stat => ({
    name: stat.stat.name,
    base_stat: stat.base_stat
  }));

  return pokemon;
}

// Função para obter os detalhes de um Pokémon específico
pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon); // Converte os dados da API para o modelo
}

// Função para buscar vários Pokémon com base no offset e limit
pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results) // Obtém apenas os resultados
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // Mapeia cada Pokémon
    .then((detailRequests) => Promise.all(detailRequests)) // Lida com as requisições assíncronas
    .then((pokemonsDetails) => pokemonsDetails); // Retorna os detalhes dos Pokémon
};