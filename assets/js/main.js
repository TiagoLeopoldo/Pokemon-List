const headerCard = document.getElementById('headerCard');
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 151; // Número máximo de Pokémon
const limit = 12; // Quantidade de Pokémon carregados por vez
let offset = 0; // Offset inicial para paginação

// Função para carregar itens de Pokémon na lista
function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    // Constrói o HTML para cada Pokémon
    const newHtml = pokemons.map((pokemon) =>
      `
    <li id="pokeDados" class="pokemon ${pokemon.type}">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
          <div class="detail">
            <ol class="types">
              ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
            </ol>
            <div class="image-container">
              <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
          </div>
        </li>
    `
    ).join('');
    pokemonList.innerHTML += newHtml; // Adiciona o HTML à lista

    showPokemonCard(); // Exibe o card com os detalhes do Pokémon
    closeCard(); // Configura o botão para fechar o card
  });
}

// Carrega os Pokémon iniciais
loadPokemonItens(offset, limit);

// Configura o evento de clique no botão para carregar mais Pokémon
loadMoreButton.addEventListener('click', () => {
  offset += limit;

  const qtdRecordsWithNextPage = offset + limit;
  if (qtdRecordsWithNextPage >= maxRecords) {
    const newLimit = maxRecords - offset; // Ajusta o limite para evitar exceder os registros
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton); // Remove o botão ao atingir o limite máximo
  } else {
    loadPokemonItens(offset, limit);
  }
});