let clientes = [];
let editandoIndex = null;

const form = document.getElementById("form");
const lista = document.getElementById("lista");
const buscaInput = document.getElementById("busca");
const buscaArea = document.getElementById("busca-area");
const resumoBusca = document.getElementById("resumo-busca");
const estadoLista = document.getElementById("estado-lista");
const contadorClientes = document.getElementById("contador-clientes");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const botaoSubmit = document.getElementById("salvar-cliente");
const botaoCancelar = document.getElementById("cancelar");
const botaoLimparBusca = document.getElementById("limpar-busca");

const dadosSalvos = localStorage.getItem("clientes");
if (dadosSalvos) {
  clientes = JSON.parse(dadosSalvos);
}

buscaInput.addEventListener("input", renderizar);

botaoLimparBusca.addEventListener("click", () => {
  buscaInput.value = "";
  renderizar();
  buscaInput.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();

  if (!nome || !email) {
    return;
  }

  if (editandoIndex !== null) {
    clientes[editandoIndex] = { nome, email };
    editandoIndex = null;
  } else {
    clientes.push({ nome, email });
  }

  salvarDados();
  limparFormulario();
  atualizarFormulario();
  renderizar();
});

botaoCancelar.addEventListener("click", () => {
  editandoIndex = null;
  limparFormulario();
  atualizarFormulario();
});

lista.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-action]");

  if (!botao) {
    return;
  }

  const index = Number(botao.dataset.index);

  if (botao.dataset.action === "remover") {
    remover(index);
    return;
  }

  if (botao.dataset.action === "editar") {
    editar(index);
  }
});

function renderizar() {
  const busca = clientes.length > 2 ? buscaInput.value.trim().toLowerCase() : "";
  const clientesFiltrados = clientes
    .map((cliente, index) => ({ cliente, index }))
    .filter(({ cliente }) => {
      return (
        cliente.nome.toLowerCase().includes(busca) ||
        cliente.email.toLowerCase().includes(busca)
      );
    });

  lista.innerHTML = "";

  clientesFiltrados.forEach(({ cliente, index }) => {
    const item = criarItemCliente(cliente, index);
    lista.appendChild(item);
  });

  atualizarBusca(busca, clientesFiltrados.length);
  atualizarResumo(clientesFiltrados.length);
}

function criarItemCliente(cliente, index) {
  const item = document.createElement("li");
  item.className = "client-item";

  const info = document.createElement("div");
  info.className = "client-info";

  const nome = document.createElement("strong");
  nome.className = "client-name";
  nome.textContent = cliente.nome;

  const email = document.createElement("span");
  email.className = "client-email";
  email.textContent = cliente.email;

  info.append(nome, email);

  const acoes = document.createElement("div");
  acoes.className = "client-actions";

  const editarButton = document.createElement("button");
  editarButton.type = "button";
  editarButton.className = "action-button";
  editarButton.dataset.action = "editar";
  editarButton.dataset.index = index;
  editarButton.textContent = "Editar";

  const removerButton = document.createElement("button");
  removerButton.type = "button";
  removerButton.className = "danger-button";
  removerButton.dataset.action = "remover";
  removerButton.dataset.index = index;
  removerButton.textContent = "Remover";

  acoes.append(editarButton, removerButton);
  item.append(info, acoes);

  return item;
}

function atualizarBusca(busca, totalFiltrados) {
  const totalClientes = clientes.length;
  const buscaAtiva = busca.length > 0;
  const deveMostrarBusca = totalClientes > 2;

  if (!deveMostrarBusca && buscaInput.value) {
    buscaInput.value = "";
  }

  buscaArea.hidden = !deveMostrarBusca;
  botaoLimparBusca.hidden = !deveMostrarBusca || !buscaAtiva;

  if (!deveMostrarBusca) {
    return;
  }

  if (buscaAtiva) {
    resumoBusca.textContent = `Mostrando ${totalFiltrados} de ${totalClientes} clientes`;
    return;
  }

  resumoBusca.textContent = "Pesquise por nome ou email";
}

function atualizarResumo(totalFiltrados) {
  const totalClientes = clientes.length;
  const plural = totalClientes === 1 ? "cliente cadastrado" : "clientes cadastrados";

  contadorClientes.textContent = `${totalClientes} ${plural}`;

  const semClientes = totalClientes === 0;
  const semResultados = totalClientes > 0 && totalFiltrados === 0;

  lista.hidden = semClientes || semResultados;
  estadoLista.hidden = !semClientes && !semResultados;

  if (semClientes) {
    estadoLista.textContent = "Adicione o primeiro cliente para comecar.";
    return;
  }

  if (semResultados) {
    estadoLista.textContent = "Nenhum cliente encontrado com essa busca.";
  }
}

function remover(index) {
  clientes.splice(index, 1);

  if (editandoIndex === index) {
    editandoIndex = null;
    limparFormulario();
    atualizarFormulario();
  } else if (editandoIndex !== null && editandoIndex > index) {
    editandoIndex -= 1;
  }

  salvarDados();
  renderizar();
}

function editar(index) {
  const cliente = clientes[index];

  nomeInput.value = cliente.nome;
  emailInput.value = cliente.email;
  editandoIndex = index;

  atualizarFormulario();
  nomeInput.focus();
}

function limparFormulario() {
  form.reset();
}

function atualizarFormulario() {
  const editando = editandoIndex !== null;

  botaoSubmit.textContent = editando ? "Salvar alteracoes" : "Adicionar cliente";
  botaoCancelar.hidden = !editando;
}

function salvarDados() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

atualizarFormulario();
renderizar();
