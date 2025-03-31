// Função para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para mostrar os detalhes do Pokémon em um card
function showPokemonCard() {
  const pokemonContent = document.getElementById('pokemonList'); // Lista de Pokémon na tela
  const pokemonCard = document.getElementById('card'); // Card que exibe os detalhes do Pokémon
  const headerCard = document.getElementById('headerCard'); // Cabeçalho do card (nome e imagem)

  // Adiciona um evento de clique na lista de Pokémon
  pokemonContent.addEventListener('click', async (event) => {
    const pokemonElement = event.target.closest('.pokemon'); // Identifica o elemento do Pokémon clicado
    if (pokemonElement) {
      const pokemonId = pokemonElement.querySelector('.number').textContent.replace('#', ''); // Obtém o ID do Pokémon

      try {
        // Busca os detalhes do Pokémon usando a API
        const pokemonDetails = await pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}` });

        // Capitaliza o nome do Pokémon
        const pokemonName = capitalizeFirstLetter(pokemonDetails.name);

        const typeClass = pokemonDetails.type || 'default'; // Define a classe do tipo
        const typeColor = getTypeColor(typeClass); // Define a cor baseada no tipo

        // Atualiza o cabeçalho do card com o nome e imagem
        headerCard.innerHTML = `
          <h2>${pokemonName}</h2>
          <img src="${pokemonDetails.photo}" alt="${pokemonName}">
        `;
        headerCard.style.backgroundImage = `url('${pokemonDetails.photo}')`; // Define o fundo como a imagem do Pokémon
        pokemonCard.style.borderColor = typeColor; // Define a borda com a cor do tipo

        // Gera o HTML dos atributos (stats) do Pokémon
        const statsHTML = pokemonDetails.stats.map(stat => {
          const statName = capitalizeFirstLetter(stat.name); // Capitaliza o nome do atributo
          const baseStat = stat.base_stat; // Valor do atributo
          const barWidth = Math.min(baseStat / 180 * 100, 100); // Calcula o percentual da barra
          return `
            <li>
              <p>${statName}:</p>
              <div class="stat-bar">
                <span style="width: ${barWidth}%; background-color: ${typeColor};"></span>
              </div>
              <span class="stat-value">${baseStat}</span>
            </li>
          `;
        }).join('');

        // Atualiza o conteúdo do card com os stats
        pokemonCard.innerHTML = `
          <div class="header-card ${typeClass}">
            <h2>${pokemonName}</h2>
            <img src="${pokemonDetails.photo}" alt="${pokemonName}">
          </div>
          <div class="stats">
            <h4>Stats:</h4>
            <ul>${statsHTML}</ul>
            <div class="pagination">
              <button type="button" id="closeCard" class="button">Close</button>
            </div>
          </div>
        `;

        pokemonCard.classList.remove('hidden'); // Mostra o card
        closeCard(); // Configura o botão de fechar
      } catch (error) {
        console.error('Erro ao obter os detalhes do Pokémon:', error); // Loga o erro no console
      }
    }
  });
}

// Função para fechar o card de detalhes do Pokémon
function closeCard() {
  const pokemonCard = document.getElementById('card'); // Card de detalhes
  const closeCardBtn = document.querySelector('#closeCard'); // Botão para fechar o card

  // Adiciona o evento de clique no botão de fechar
  if (closeCardBtn) {
    closeCardBtn.addEventListener('click', () => {
      pokemonCard.classList.add('hidden'); // Esconde o card
    });
  } else {
    console.error('Botão "Close" não encontrado no DOM.'); // Loga um erro caso o botão não exista
  }
}

// Função para obter a cor associada ao tipo do Pokémon
function getTypeColor(type) {
  const colors = {
    normal: "#a6a877",
    grass: "#77c850",
    fire: "#ee7f30",
    water: "#678fee",
    electric: "#f7cf2e",
    ice: "#98d5d7",
    ground: "#dfbf69",
    flying: "#a98ff0",
    poison: "#a040a0",
    fighting: "#bf3029",
    psychic: "#f65687",
    dark: "#725847",
    rock: "#b8a137",
    bug: "#a8b720",
    ghost: "#6e5896",
    steel: "#b9b7cf",
    dragon: "#6f38f6",
    fairy: "#f9aec7",
    default: "#ddd" // Cor padrão para tipos desconhecidos
  };
  return colors[type] || colors.default; // Retorna a cor do tipo ou uma cor padrão
}