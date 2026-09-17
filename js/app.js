/* ===== Swift – Interações JS (carrinho, toasts, persistência) ===== */

const fmtBRL = v => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CART_KEY = 'swift_cart_v1';
let cart = loadCart();

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price) {
  const idx = cart.findIndex(i => i.name === name);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ name, price: Number(price || 0), qty: 1 });
  saveCart();
  updateCartUI();
  toast(`Adicionado: <strong>${name}</strong>`);
}

function setQty(name, qty) {
  const i = cart.findIndex(x => x.name === name);
  if (i < 0) return;
  cart[i].qty = Math.max(0, Number(qty || 0));
  if (cart[i].qty === 0) cart.splice(i, 1);
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function cartTotal() { return cart.reduce((s, i) => s + i.qty * i.price, 0); }

function updateCartUI() {
  const count = cartCount();
  const total = fmtBRL(cartTotal());

  document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
}

function toast(html) {
  const hasBootstrap = !!window.bootstrap;
  if (!hasBootstrap) {
    const div = document.createElement('div');
    div.innerHTML = html.replace(/<[^>]+>/g,'');
    alert(div.textContent || 'OK');
    return;
  }
  let toaster = document.getElementById('toaster');
  if (!toaster) {
    toaster = document.createElement('div');
    toaster.id = 'toaster';
    toaster.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(toaster);
  }
  const wrapper = document.createElement('div');
  wrapper.className = 'toast align-items-center text-bg-dark border-0';
  wrapper.role = 'status';
  wrapper.ariaLive = 'polite';
  wrapper.ariaAtomic = 'true';
  wrapper.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${html}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
    </div>`;
  toaster.appendChild(wrapper);
  const t = new bootstrap.Toast(wrapper, { delay: 1800 });
  t.show();
  wrapper.addEventListener('hidden.bs.toast', () => wrapper.remove());
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // ===== Cabeçalho: NAVEGAÇÃO CORRETA =====
  const btnLogin   = document.querySelector('header .btn.btn-primary'); // "Já tenho conta"
  const btnSignup  = document.querySelector('header .btn.btn-light');   // "Criar nova conta"
  const forgotLink = document.querySelector('header a.link-dark');      // "Esqueci a senha"

  btnLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    location.href = 'login.html';
  });
  btnSignup?.addEventListener('click', (e) => {
    e.preventDefault();
    location.href = 'cadastro.html#signup';
  });
  forgotLink?.addEventListener('click', (e) => {
    e.preventDefault();
    location.href = 'cadastro.html#forgot';
  });

  // Conecta TODOS os botões "ADICIONAR" que têm data-add/data-price
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const name = btn.dataset.add;
    const price = parseFloat(btn.dataset.price || '0');
    addToCart(name, price);
  });

  // Duplo clique no total do rodapé limpa o carrinho (atalho)
  document.querySelector('footer [data-cart-total]')?.addEventListener('dblclick', () => {
    if (confirm('Limpar carrinho?')) clearCart();
  });
});

// expõe funções pra usar em onclick se quiser
window.addToCart = addToCart;
window.setQty = setQty;
window.clearCart = clearCart;
// sanity check
console.log('app.js carregado');

/* ===== Busca de produtos ===== */

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('searchInput');
  const searchForm = document.getElementById('searchForm');

  if (!searchInput) {
    console.warn('Campo de busca não encontrado.');
    return;
  }

  function buscarProdutos() {

    const termo = searchInput.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

    const produtos = document.querySelectorAll('.ofertas article');

    produtos.forEach(produto => {

      const nomeElemento = produto.querySelector('h6');

      if (!nomeElemento) return;

      const nome = nomeElemento.textContent
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

      const encontrou = termo === '' || nome.includes(termo);

      produto.style.display = encontrou ? '' : 'none';
    });
  }

  // Pesquisa enquanto digita
  searchInput.addEventListener('input', buscarProdutos);

  // Impede o formulário de recarregar a página
  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    buscarProdutos();
  });

});

/* ===== Página de Carrinho ===== */
function renderCartPage() {
  const table = document.querySelector('#cart-table tbody');
  const empty = document.querySelector('[data-cart-empty]');
  if (!table) return; // não está na carrinho.html

  // monta linhas
  table.innerHTML = '';
  if (cart.length === 0) {
    empty?.removeAttribute('hidden');
  } else {
    empty?.setAttribute('hidden','');
    cart.forEach(item => {
      const tr = document.createElement('tr');
      tr.dataset.name = item.name;

      tr.innerHTML = `
        <td class="fw-semibold">${item.name}</td>
        <td class="text-end d-none d-md-table-cell">${fmtBRL(item.price)}</td>
        <td class="text-center">
          <div class="btn-group" role="group" aria-label="Alterar quantidade">
            <button class="btn btn-light" data-action="dec" title="Diminuir">−</button>
            <input type="number" class="form-control text-center" style="width:64px" min="0" step="1" value="${item.qty}" data-qty>
            <button class="btn btn-light" data-action="inc" title="Aumentar">+</button>
          </div>
        </td>
        <td class="text-end fw-semibold" data-subtotal>${fmtBRL(item.qty * item.price)}</td>
        <td class="text-center">
          <button class="btn btn-outline-danger btn-sm" data-action="remove" title="Remover">
            <i class="bi bi-x-lg"></i>
          </button>
        </td>
      `;
      table.appendChild(tr);
    });
  }
  updateCartUI(); // atualiza contadores/total visíveis
}

document.addEventListener('DOMContentLoaded', renderCartPage);

// Delegation: + / - / remover / limpar
document.addEventListener('click', (e) => {
  // limpar
  if (e.target.closest('[data-clear]')) {
    e.preventDefault();
    if (confirm('Limpar carrinho?')) {
      clearCart();
      renderCartPage();
    }
    return;
  }

  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const tr = btn.closest('tr[data-name]');
  if (!tr) return;

  const name = tr.dataset.name;
  const item = cart.find(i => i.name === name);
  if (!item) return;

  if (action === 'inc') setQty(name, item.qty + 1);
  if (action === 'dec') setQty(name, item.qty - 1);
  if (action === 'remove') setQty(name, 0);

  renderCartPage();
});

// Alterar quantidade digitando
document.addEventListener('change', (e) => {
  const input = e.target.closest('input[data-qty]');
  if (!input) return;
  const tr = input.closest('tr[data-name]');
  if (!tr) return;
  const name = tr.dataset.name;
  const qty = Math.max(0, parseInt(input.value || '0', 10));
  setQty(name, qty);
  renderCartPage();
});

/* ===== Cadastro: validar PF/PJ, salvar usuário e ir para index.html ===== */
document.addEventListener('DOMContentLoaded', () => {
  const formPF = document.getElementById('formPF');
  const formPJ = document.getElementById('formPJ');

  function submitOK(msg) {
    alert(msg || 'Cadastro concluído! Redirecionando…');
    location.href = 'index.html'; // agora vai para a home
  }

  function validarEEnviarPF(e){
    e.preventDefault();
    const p1 = document.getElementById('pf-pass')?.value.trim()  || '';
    const p2 = document.getElementById('pf-pass2')?.value.trim() || '';
    const termos = document.getElementById('pfTermos')?.checked  || false;

    if (p1.length < 8) return alert('Senha (PF) deve ter ao menos 8 caracteres.');
    if (p1 !== p2)     return alert('As senhas (PF) não conferem.');
    if (!termos)       return alert('Você precisa aceitar a Política de privacidade (PF).');

    // Salvar usuário (PF) no localStorage
    const email = document.querySelector('#formPF .campo-email input')?.value.trim() || '';
    const first = document.querySelector('#formPF .campo-primeiro-nome input')?.value.trim() || '';
    const last  = document.querySelector('#formPF .campo-ultimo-nome input')?.value.trim()   || '';
    const name  = (first + ' ' + last).trim() || (email.split('@')[0] || 'Cliente');
    localStorage.setItem('swift_account', JSON.stringify({email,name, password: p1 }));
    localStorage.setItem('swift_user', JSON.stringify({ email, name }));
    submitOK('Cadastro (PF) concluído! Redirecionando…');
  }

  function validarEEnviarPJ(e){
    e.preventDefault();
    const p1 = document.getElementById('pj-pass')?.value.trim()  || '';
    const p2 = document.getElementById('pj-pass2')?.value.trim() || '';
    const termos = document.getElementById('pjTermos')?.checked  || false;

    if (p1.length < 8) return alert('Senha (PJ) deve ter ao menos 8 caracteres.');
    if (p1 !== p2)     return alert('As senhas (PJ) não conferem.');
    if (!termos)       return alert('Você precisa aceitar a Política de privacidade (PJ).');

    // Salvar usuário (PJ) no localStorage
    const email    = document.querySelector('#formPJ .campo-email input')?.value.trim() || '';
    const fantasia = document.querySelector('#formPJ .campo-fantasia input')?.value.trim() || '';
    const razao    = document.querySelector('#formPJ .campo-razao input')?.value.trim()    || '';
    const name     = fantasia || razao || (email.split('@')[0] || 'Cliente');
    localStorage.setItem('swift_account', JSON.stringify({ email, name, password: p1}));
    localStorage.setItem('swift_user', JSON.stringify({email, name}));
    submitOK('Cadastro (PJ) concluído! Redirecionando…');
  }

  formPF?.addEventListener('submit', validarEEnviarPF);
  formPJ?.addEventListener('submit', validarEEnviarPJ);
});

const welcome = document.getElementById('welcomeSlot');
const authBtns = document.querySelectorAll(
  '#userActions [data-auth="login"], #userActions [data-auth="signup"], #userActions [data-auth="forgot"]'
);
const logoutBtn = document.querySelector(
  '#userActions [data-auth="logout"]'
);
function setAuthUI(user) {
  if (user && user.name) {
    // Usuário logado
    welcome.innerHTML = `
      Olá, <strong>${user.name}</strong>
    `;
    welcome.classList.remove('d-none');

    // Esconde os botões de login/cadastro
    authBtns.forEach(button => {
      button.classList.add('d-none');
    });

    // Mostra o botão Sair
    logoutBtn?.classList.remove('d-none');
  } else {

    // Usuário deslogado
    welcome.classList.add('d-none');

    // Mostra login/cadastro
    authBtns.forEach(button => {
      button.classList.remove('d-none');
    });

    // Esconde Sair
    logoutBtn?.classList.add('d-none');
  }
}

logoutBtn?.addEventListener('click', () => {
  // Remove somente a sessão
  localStorage.removeItem('swift_user');

  // Atualiza o cabeçalho
  setAuthUI(null);
});

const stored = localStorage.getItem('swift_user');

let user = null;

try {
  user = stored ? JSON.parse(stored) : null;
} catch (error) {
  console.warn('Sessão inválida. Limpando sessão.');
  localStorage.removeItem('swift_user');
}

setAuthUI(user);

/* ===== Finalizar compra ===== */

document.addEventListener('click', (e) => {

  const checkoutBtn = e.target.closest('[data-checkout]');

  if (!checkoutBtn) return;

  if (cart.length === 0) {
    toast('Seu carrinho está vazio.');
    return;
  }

  const total = fmtBRL(cartTotal());

  // Salva o total para a página de finalização
  localStorage.setItem('swift_order_total', total);

  // Limpa o carrinho
  clearCart();

  // Vai diretamente para a confirmação do pedido
  window.location.href = 'finalizacao.html';

});


/* ===== Voltar ao topo ===== */

document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('backToTop');

  if (!backToTop) return;

  function atualizarBotaoTopo() {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }

  window.addEventListener('scroll', atualizarBotaoTopo);

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  atualizarBotaoTopo();
});



/* ===== Página padrão de produto ===== */

const catalogoProdutos = {

  patinho: {
    nome: 'CARNE MOÍDA DE PATINHO 1KG',
    preco: 49.90,
    imagem: 'images/moida_patinho.png',
    embalagem: 'EMBALAGEM DE 1KG',
    categoria: 'BOVINOS',
    descricao: 'Carne moída de patinho, selecionada e ultracongelada. Ideal para hambúrgueres, molhos, recheios e diversas receitas do dia a dia.'
  },

  almondegas: {
    nome: 'ALMÔNDEGAS BOVINAS 500G',
    preco: 18.90,
    imagem: 'images/almond_bovina.png',
    embalagem: 'EMBALAGEM DE 500G',
    categoria: 'BOVINOS',
    descricao: 'Almôndegas bovinas selecionadas e prontas para preparar. Uma opção prática para suas refeições.'
  },

  'bife-contrafile': {
    nome: 'BIFE DE CONTRAFILÉ',
    preco: 49.90,
    imagem: 'images/bife_contrafile.png',
    embalagem: 'PREÇO AO KG',
    categoria: 'BOVINOS',
    descricao: 'Bifes de contrafilé selecionados, ideais para preparar na frigideira, churrasqueira ou grelha.'
  },

  'contrafile-combo': {
    nome: 'CONTRAFILÉ COMBO 1,1KG',
    preco: 44.90,
    imagem: 'images/contrafile_combo.png',
    embalagem: 'EMBALAGEM',
    categoria: 'BOVINOS',
    descricao: 'Combo de contrafilé para deixar suas refeições ainda mais práticas e saborosas.'
  }

};


function carregarProduto() {

  const paginaProduto = document.getElementById('produtoNome');

  if (!paginaProduto) return;

  const parametros = new URLSearchParams(window.location.search);
  const idProduto = parametros.get('id');

  const produto = catalogoProdutos[idProduto];

  if (!produto) {

    paginaProduto.textContent = 'Produto não encontrado';

    document.getElementById('produtoDescricao').textContent =
      'O produto que você procura não está disponível.';

    return;
  }

  document.title = `Swift — ${produto.nome}`;

  const imagem = document.getElementById('produtoImagem');
  const categoria = document.getElementById('produtoCategoria');
  const nome = document.getElementById('produtoNome');
  const descricao = document.getElementById('produtoDescricao');
  const embalagem = document.getElementById('produtoEmbalagem');
  const preco = document.getElementById('produtoPreco');

  imagem.src = produto.imagem;
  imagem.alt = produto.nome;

  categoria.textContent = produto.categoria;
  nome.textContent = produto.nome;
  descricao.textContent = produto.descricao;
  embalagem.textContent = produto.embalagem;
  preco.textContent = fmtBRL(produto.preco);

  const btnAdicionar = document.getElementById('btnAdicionar');
  const quantidade = document.getElementById('produtoQuantidade');

  btnAdicionar?.addEventListener('click', () => {

    const qtd = Math.max(
      1,
      Number(quantidade.value || 1)
    );

    for (let i = 0; i < qtd; i++) {
      addToCart(produto.nome, produto.preco);
    }

    btnAdicionar.innerHTML =
      '<i class="bi bi-check2 me-1"></i> Adicionado ao carrinho';

    btnAdicionar.classList.remove('btn-primary');
    btnAdicionar.classList.add('btn-success');

    setTimeout(() => {

      btnAdicionar.innerHTML =
        '<i class="bi bi-cart-plus me-1"></i> Adicionar ao carrinho';

      btnAdicionar.classList.remove('btn-success');
      btnAdicionar.classList.add('btn-primary');

    }, 1200);

  });

}


document.addEventListener('DOMContentLoaded', () => {

  carregarProduto();

  const btnMenos = document.getElementById('btnMenos');
  const btnMais = document.getElementById('btnMais');
  const quantidade = document.getElementById('produtoQuantidade');

  btnMenos?.addEventListener('click', () => {

    const valor = Number(quantidade.value || 1);

    if (valor > 1) {
      quantidade.value = valor - 1;
    }

  });


  btnMais?.addEventListener('click', () => {

    const valor = Number(quantidade.value || 1);

    if (valor < 99) {
      quantidade.value = valor + 1;
    }

  });


  quantidade?.addEventListener('change', () => {

    let valor = Number(quantidade.value || 1);

    if (valor < 1) valor = 1;
    if (valor > 99) valor = 99;

    quantidade.value = valor;

  });

});