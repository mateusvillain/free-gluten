import { useMemo, useState } from 'react';
import restaurantes from './data/restaurantes.json';

const TAGS = {
  'nao-possui-gluten': {
    label: 'Não possui glúten',
    className: 'tag-sm tag--sm tag--container-success tag--circle',
  },
  'opcoes-sem-gluten': {
    label: 'Possui opções sem glúten',
    className: 'tag-sm tag--sm tag--surface-caution tag--circle',
  },
};

const CARDAPIO_OPCOES = [
  { value: 'todos', label: 'Todo tipo de cardápio' },
  { value: 'nao-possui-gluten', label: 'Não possui glúten' },
  { value: 'opcoes-sem-gluten', label: 'Possui opções sem glúten' },
];

function App() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [cardapio, setCardapio] = useState('todos');

  const categorias = useMemo(() => {
    const categoriasUnicas = [...new Set(restaurantes.map((item) => item.categoria))];
    return categoriasUnicas.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, []);

  const restaurantesFiltrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();

    return restaurantes.filter((restaurante) => {
      const bateBusca =
        buscaNormalizada.length === 0 ||
        restaurante.nome.toLowerCase().includes(buscaNormalizada) ||
        restaurante.endereco.toLowerCase().includes(buscaNormalizada) ||
        restaurante.categoria.toLowerCase().includes(buscaNormalizada);

      const bateCategoria = categoria === 'todas' || restaurante.categoria === categoria;
      const bateCardapio = cardapio === 'todos' || restaurante.tipoCardapio === cardapio;

      return bateBusca && bateCategoria && bateCardapio;
    });
  }, [busca, categoria, cardapio]);

  const totalResultados = restaurantesFiltrados.length;
  const textoResultados =
    totalResultados === 1
      ? '1 restaurante encontrado'
      : `${totalResultados} restaurantes encontrados`;

  return (
    <main className="app">
      <header className="hero">
        <h1 className="title">Criciúma sem Glúten</h1>
        <p className="body--lg">
          Encontre lugares com cardápio totalmente livre ou com opções sem glúten no menu. Envie sugestões ou correções pelo Instagram {' '}
          <a
            className="link"
            href="https://instagram.com/mateusvillain"
            target="_blank"
            rel="noreferrer"
          >
            @mateusvillain
          </a>
        </p>
      </header>

      <section className="card card__border filters-panel" aria-label="Busca e filtros">
        <form className="card__body form__lg filters" onSubmit={(event) => event.preventDefault()}>
          <div className="form__group full-width">
            <label htmlFor="busca-restaurante">Buscar</label>
            <input
              id="busca-restaurante"
              type="search"
              placeholder="Busque por nome, categoria ou endereço"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          <div className="form__group">
            <label htmlFor="filtro-categoria">Categoria</label>
            <select
              id="filtro-categoria"
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              <option value="todas">Todas as categorias</option>
              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form__group">
            <label htmlFor="filtro-cardapio">Cardápio</label>
            <select
              id="filtro-cardapio"
              value={cardapio}
              onChange={(event) => setCardapio(event.target.value)}
            >
              {CARDAPIO_OPCOES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </form>
      </section>

      {totalResultados > 0 && <p className="results-count body--md">{textoResultados}</p>}

      <section className="restaurant-grid" aria-label="Lista de restaurantes">
        {restaurantesFiltrados.length === 0 && (
          <article className="card card__border empty-state">
            <div className="card__body">
              <h2 className="block-title">Nenhum restaurante encontrado</h2>
              <p className="body--md">
                Ajuste a busca ou os filtros para encontrar novos lugares sem glúten.
              </p>
            </div>
          </article>
        )}

        {restaurantesFiltrados.map((restaurante) => {
          const tag = TAGS[restaurante.tipoCardapio];

          return (
            <article className="card card__border restaurant-card" key={restaurante.id}>
              <div className="card__body">
                <div className="card-top">
                  <h2 className="block-title">{restaurante.nome}</h2>
                  <div className="card-tags">
                    <p className="tag-sm tag--sm tag--surface-primary tag--circle">
                      {restaurante.categoria}
                    </p>
                    <p className={tag.className}>{tag.label}</p>
                  </div>
                </div>

                <p className="address body--lg">{restaurante.endereco}</p>

                <div className="links">
                  <a className="link body--lg" href={restaurante.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                  <a className="link body--lg" href={restaurante.whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default App;
