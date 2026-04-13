let clientes = [];
let editandoIndex = null;

// 🔗 elementos
const form = document.getElementById("form");
const lista = document.getElementById("lista");
const buscaInput = document.getElementById("busca");
const botaoSubmit = form.querySelector("button");
const botaoCancelar = document.getElementById("cancelar");

// 💾 carregar dados
const dadosSalvos = localStorage.getItem("clientes");
if (dadosSalvos) {
  clientes = JSON.parse(dadosSalvos);
}

// 🔍 busca em tempo real
buscaInput.addEventListener("input", function () {
  renderizar();
});

// 🚀 submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();

  if (!nome || !email) return;

  if (editandoIndex !== null) {
    clientes[editandoIndex] = { nome, email };
    editandoIndex = null;
  } else {
    clientes.push({ nome, email });
  }

  salvarDados();

  nomeInput.value = "";
  emailInput.value = "";
  botaoSubmit.textContent = "Adicionar Cliente";
  botaoCancelar.style.display = "none";

  renderizar();
});

// 🖥️ renderizar com filtro
function renderizar() {
  lista.innerHTML = "";

  const busca = buscaInput.value.toLowerCase();

  clientes
    .filter((cliente) => {
      return (
        cliente.nome.toLowerCase().includes(busca) ||
        cliente.email.toLowerCase().includes(busca)
      );
    })
    .forEach((cliente) => {
      const indexReal = clientes.indexOf(cliente);

      const li = document.createElement("li");

      li.innerHTML = `
        <span>${cliente.nome} - ${cliente.email}</span>
        <div>
          <button onclick="remover(${indexReal})">Remover</button>
          <button onclick="editar(${indexReal})">Editar</button>
        </div>
      `;

      lista.appendChild(li);
    });
}

// ❌ remover
function remover(index) {
  clientes.splice(index, 1);
  salvarDados();
  renderizar();
}

// 💾 salvar
function salvarDados() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// ✏️ editar
function editar(index) {
  const cliente = clientes[index];

  document.getElementById("nome").value = cliente.nome;
  document.getElementById("email").value = cliente.email;

  botaoSubmit.textContent = "Atualizar Cliente";
  botaoCancelar.style.display = "block";

  editandoIndex = index;
}

// 🚫 cancelar
botaoCancelar.addEventListener("click", function () {
  editandoIndex = null;

  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";

  botaoSubmit.textContent = "Adicionar Cliente";
  botaoCancelar.style.display = "none";
});

// 🔥 iniciar
renderizar();
