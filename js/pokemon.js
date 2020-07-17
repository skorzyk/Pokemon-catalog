class Pokemon {
  constructor(version, resource, pageSize, currentPage) {
    this.API = 'https://api.pokemontcg.io';
    this.APIversion = version;
    this.APIresource = resource;
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.button = document.querySelector('.button');
    this.loader = document.querySelector('.lds-hourglass');
    this.search = document.querySelector('.search__input');
    this.info = document.querySelector('.catalog__info');

    this.newCards = [];
    this.cardsList = [];

    this.APIEndPoint = `${this.API}/${this.APIversion}/${this.APIresource}`;
  }

  toogleShowElement(...elements) {
    elements.forEach((element) => {
      element.classList.toggle('hide');
    });
  }

  getCards() {
    fetch(
      `${this.APIEndPoint}?page=${this.currentPage}&pageSize=${this.pageSize}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.toogleShowElement(this.loader, this.button);
        const { cards } = data;
        this.toogleShowElement(this.loader, this.button);
        this.cardsList = [...this.cardsList, ...cards];
        this.newCards = [...cards];
        this.createCatalog(this.newCards);
        this.currentPage++;
      });
  }

  createCatalog(cards) {
    this.catalog = document.querySelector('#cards');

    const pokemonCard = cards.map((card) => this.createCard(card)).join('');
    this.catalog.insertAdjacentHTML('beforeend', pokemonCard);
  }

  createCard(card) {
    return `
    <div class="card" id=${card.id}>
<header class="card__header">
    <h2 class="card__name">${card.name}</h2>
    <p class="card__number">Nr: ${card.number}</p>
    <img class="card__img" src="${card.imageUrl}" alt="${card.name}">
<p class="card__desc"><span>Supertyp</span>: ${card.supertype}</p>
<p class="card__desc ${card.subtype ? '' : 'hide'}"><span>Podtyp</span>: ${
      card.subtype
    }</p>
<p class="card__desc ${card.rarity ? '' : 'hide'}"><span>Występowanie</span>: ${
      card.rarity
    }</p>
</header>
</div>
`;
  }

  searchCards() {
    const searchedCard = this.search.value.toLowerCase();
    searchedCard.length
      ? this.button.classList.add('hide')
      : this.button.classList.remove('hide');
    document
      .querySelectorAll('.card')
      .forEach((el) => el.classList.remove('hide'));
    const filteredCards = this.cardsList.filter(
      ({ name }) => !name.toLowerCase().includes(searchedCard)
    );
    filteredCards.forEach(({ id }) =>
      document.getElementById(id).classList.add('hide')
    );
    filteredCards.length === this.cardsList.length
      ? this.info.classList.remove('hide')
      : this.info.classList.add('hide');
  }

  addEventListeners() {
    this.button.addEventListener('click', () => this.getCards());
    this.search.addEventListener('keyup', () => this.searchCards());
  }

  init() {
    this.getCards();
    this.addEventListeners();
  }
}

const pokemon = new Pokemon('v1', 'cards', 4, 1);

pokemon.init();
