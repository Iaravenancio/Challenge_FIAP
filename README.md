# Challenge_FIAP
🛒 Projeto Swift — E-commerce Interativo

Projeto desenvolvido para o **FIAP Challenge**, com o objetivo de criar uma experiência de e-commerce para a Swift, aplicando conceitos de desenvolvimento web, responsividade, navegação entre páginas e interatividade com JavaScript.

🔗 **Projeto online:**  
https://iaravenancio.github.io/Challenge_FIAP/

🔗 **Repositório:**  
https://github.com/Iaravenancio/Challenge_FIAP

---

## 📌 Sobre o projeto

O **Swift E-commerce** é uma aplicação web desenvolvida como projeto acadêmico para simular a experiência de compra de produtos Swift.

A interface foi construída a partir de uma proposta visual definida no projeto do Challenge, buscando reproduzir uma experiência de navegação simples, organizada e responsiva.

O projeto conta com páginas de produtos, categorias, carrinho, autenticação simulada e finalização de compra, utilizando recursos do navegador para manter algumas informações durante a navegação.

---

## 🎯 Objetivos

O projeto teve como principais objetivos:

- Desenvolver uma interface de e-commerce utilizando tecnologias web;
- Aplicar conceitos de HTML, CSS e JavaScript;
- Criar uma navegação entre diferentes páginas;
- Desenvolver uma experiência de compra com carrinho;
- Trabalhar com armazenamento de informações utilizando `localStorage`;
- Aplicar responsividade para diferentes tamanhos de tela;
- Praticar organização de arquivos e estruturação de um projeto web;
- Publicar a aplicação utilizando GitHub Pages.

---

## ✨ Funcionalidades

### 🏠 Página inicial

- Banner principal;
- Navegação por categorias;
- Produtos em destaque;
- Ofertas;
- Seções de receitas e conteúdos;
- Área de benefícios;
- Navegação para outras áreas do site.

### 🥩 Produtos e categorias

O projeto possui páginas e áreas destinadas à apresentação dos produtos, incluindo categorias como:

- Bovinos;
- Suínos;
- Aves;
- Outros produtos;
- Acessórios.

### 🛒 Carrinho de compras

O usuário pode:

- Adicionar produtos ao carrinho;
- Visualizar os produtos selecionados;
- Alterar a quantidade;
- Remover produtos;
- Visualizar o total da compra;
- Avançar para a etapa de finalização.

Os dados do carrinho são armazenados no navegador utilizando `localStorage`.

### 👤 Cadastro e login

O projeto possui páginas de:

- Cadastro;
- Login;
- Área de identificação do usuário;
- Logout.

A autenticação é **simulada no front-end**, utilizando armazenamento local do navegador. Não há, neste projeto, uma API ou banco de dados responsável pela autenticação.

### 💳 Finalização da compra

Após o carrinho, o usuário pode avançar para uma página de finalização da compra.

Essa etapa representa uma **simulação de checkout**, não sendo processado um pagamento real.

### 🍽️ Monte seu cardápio

Página destinada à interação com produtos e composição de opções para o usuário, seguindo a proposta visual do projeto.

### 📱 Responsividade

A interface utiliza recursos do **Bootstrap** e CSS personalizado para adaptar os componentes a diferentes tamanhos de tela.

---

## 🛠️ Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **Bootstrap 5**
- **Bootstrap Icons**
- **LocalStorage**
- **GitHub Pages**

---

## 📂 Estrutura do projeto

```text
Challenge_FIAP/
│
├── css/
│   ├── styles.css
│   └── theme.css
│
├── images/
│   └── arquivos de imagens utilizados no projeto
│
├── js/
│   └── app.js
│
├── index.html
├── bovinos.html
├── cadastro.html
├── carrinho.html
├── finalizacao.html
├── login.html
├── monteseucardapio.html
├── ar.html
│
├── .gitignore
└── README.md
