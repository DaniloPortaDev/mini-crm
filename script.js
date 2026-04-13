let clientes = [];

const dadosSalvos = localStorage.getItem("clientes");
if (dadosSalvos) {
  clientes = JSON.parse(dadosSalvos);
}

const form = document.getElementById("form");
const lista = document.getElementById("lista");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();

  if (!nome || !email) return;

  clientes.push({ nome, email });

  salvarDados();

  nomeInput.value = "";
  emailInput.value = "";

  renderizar();
});

function renderizar() {
  lista.innerHTML = "";

  clientes.forEach((cliente, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${cliente.nome} - ${cliente.email}</span>
      <button onclick="remover(${index})">Remover</button>
    `;

    lista.appendChild(li);
  });
}

function remover(index) {
  clientes.splice(index, 1);
  salvarDados();
  renderizar();
}

function salvarDados() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

renderizar();
