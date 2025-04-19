# 🎬 Catálogo de Filmes - React Native + OMDb API

Aplicativo mobile desenvolvido em **React Native com Expo**, que permite aos usuários:

- Pesquisar filmes via API OMDb  
- Visualizar detalhes completos  
- Filtrar por ano e gênero  
- Favoritar filmes com ❤️  
- Avaliar com estrelas ⭐ e deixar comentários  
- Ver favoritos salvos  
- Interface moderna com tema escuro 🌓  

---

## 📱 Funcionalidades

### 🔎 Busca de Filmes
- Campo de busca na tela inicial  
- Integração com a API OMDb ([omdbapi.com](http://www.omdbapi.com))  
- Debounce para evitar múltiplas requisições simultâneas  

### 📅 Filtro por Ano e Gênero
- Filtros em formato de botões/menus personalizados  
- Permite ao usuário refinar sua pesquisa combinando ano e gênero  
- Suporte à listagem de anos recentes (últimos 20 anos)  

### 🎨 Interface
- Tema escuro (preto e laranja como cores principais)  
- Layout responsivo e moderno  
- Animações suaves e interação fluida  

### ❤️ Favoritos
- O usuário pode adicionar/remover um filme aos favoritos  
- Persistência local com **AsyncStorage**  
- Tela dedicada aos favoritos  

### ⭐ Avaliações
- Sistema de avaliação com estrelas (1 a 5)  
- Campo de nome e comentário  
- Armazenamento local usando **AsyncStorage**  
- Visualização das avaliações na tela de detalhes  

---

## 📂 Estrutura de Telas

| Tela               | Descrição                                                                 |
|--------------------|---------------------------------------------------------------------------|
| `HomeScreen.tsx`   | Busca, filtros, listagem dos filmes                                       |
| `DetailScreen.tsx` | Exibição detalhada + avaliações + botão de favoritar                     |
| `FavoritesScreen.tsx` | Lista com os filmes marcados como favoritos                           |
| `MovieCard.tsx`    | Card do filme com título, ano, imagem e ícones de favoritos/avaliação     |

---

## ⚙️ Tecnologias Utilizadas

| Ferramenta                 | Descrição                                              |
|---------------------------|--------------------------------------------------------|
| React Native + Expo       | Framework principal para desenvolvimento mobile        |
| TypeScript                | Tipagem estática                                       |
| OMDb API                  | Fonte dos dados dos filmes                             |
| AsyncStorage              | Armazenamento local (favoritos, avaliações)            |
| Expo Router               | Navegação entre telas                                  |
| React Native Vector Icons| Ícones bonitos e customizáveis                          |

---


# 📱 Catálogo de Filmes – Telas

 Telas do aplicativo *Catálogo de Filmes*, com uma breve descrição de cada funcionalidade visível.

---

## 🟠 Tela Inicial com Filtros Aplicados

![Tela com filtros de ano e gênero aplicados](MovieCatalogApp/imgs/Captura%20de%20tela%202025-04-19%20141712.png)

Nesta tela, o usuário já selecionou os filtros:
- **Ano:** `2024`
- **Gênero:** `Comedy`

Além disso:
- Há um campo de **busca personalizada** com ícone de lupa.
- Os filmes são listados com:
  - Cartaz
  - Título
  - Ano
  - Avaliação média por estrelas (até 5)

A interface utiliza a paleta de **preto com laranja** para destacar as ações principais.

---

## 📊 Tela com Lista de Anos e Gêneros Expandida

![Filtros expandidos de ano e gênero](MovieCatalogApp/imgs/Captura%20de%20tela%202025-04-19%20141605.png)

Funcionalidade ativa:
- Filtros **expandidos** de ano (`2025`) e gênero (`Action`)
- Lista rolável para o usuário navegar entre os anos e gêneros disponíveis

Essa tela reforça a **exploração refinada** do conteúdo por meio de filtros combinados.

---

## ❤️ Tela de Favoritos

![Lista de filmes favoritados pelo usuário](MovieCatalogApp/imgs/Captura%20de%20tela%202025-04-19%20142246.png)

Título da tela: **"Seus Filmes Favoritos"**  
Descrição:
- Lista de todos os filmes marcados com ❤️ pelo usuário
- Cada card mostra:
  - Cartaz
  - Título
  - Ano
  - Avaliação média por estrelas
  - Ícone de favorito no topo direito

---



## 📝 Tela de Detalhes de um Filme

![Tela com detalhes, avaliação e comentários](MovieCatalogApp/imgs/Captura%20de%20tela%202025-04-19%20142331.png)

Componentes visíveis:
- Cartaz em destaque
- Informações completas:
  - Título
  - Gênero
  - Diretor
  - Atores
  - Sinopse
- Área de **avaliação por estrelas**
- Campo para **nome e comentário**
- Botão para **enviar avaliação**
- Lista com **comentários de outros usuários**

Essa tela oferece **interatividade e engajamento**, permitindo que os usuários expressem suas opiniões.

---

> ⚙️ Todas as telas seguem uma identidade visual moderna, acessível e consistente, com foco em usabilidade e visual atrativo.



## 🎥 Demonstração em Vídeo

<video width="100%" controls>
  <source src="MovieCatalogApp/imgs/Demo-video.mp4.mp4" type="video/mp4">
</video>



---


## 🛠️ Melhorias Futuras
- Sistema de autenticação

- Compartilhamento de avaliações entre usuários

- Suporte a vídeos e trailers

- Tema claro/escuro dinâmico

## 📚 Aprendizados da Atividade
 Esta atividade teve como objetivo:

Praticar o consumo de APIs externas (OMDb)

Trabalhar com armazenamento local usando AsyncStorage

Aplicar boas práticas com React Hooks

Criar um app completo com diversas telas e navegação fluida

Também serviu como prática de:

Trabalhar com FlatList e componentes personalizados

Usar useFocusEffect para atualização dinâmica

Modularização e boas práticas em React Native


## 📌 Como Rodar o Projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/catalogo-filmes-app.git

# Acesse a pasta
cd catalogo-filmes-app

# Instale as dependências
npm install

# Inicie com Expo
npx expo start