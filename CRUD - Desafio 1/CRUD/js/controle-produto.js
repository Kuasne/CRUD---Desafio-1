const URL = 'http://localhost:3400/produtos'

let listaDeProdutos = [];
let btnAdicionar = document.querySelector('#btn-adicionar');
let tabelaProduto = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById('modal-produto'));

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    quantidadeEstoque: document.querySelector("#quantidadeEstoque"),
    valor: document.querySelector("#valor"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar: document.querySelector("#btn-salvar"),
    btnCancelar: document.querySelector("#btn-cancelar")
}


btnAdicionar.addEventListener('click', () => {
    limparModalProduto();
    modalProduto.show();
});

//obter produtos da API
function obterProdutos() {
    fetch(URL, {
        method: 'GET',
        headers: {
            'Authorization': obterToken()
        }
    })
        .then((response) => response.json())
        .then(produtos => {
            listaDeProdutos = produtos;
            popularTabela(produtos)
        })
        .catch((erro) => { });
}

obterProdutos();

function popularTabela(produtos) {

    //limpa tabela
    tabelaProduto.textContent = '';

    produtos.forEach(produto => {
        criarLinhaNaTabela(produto);
    });
}

function criarLinhaNaTabela(produto) {
    //criar tr(linha) na tabela
    let tr = document.createElement("tr");

    //criando conteudo da tabela
    let tdId = document.createElement('td');
    let tdNome = document.createElement("td");
    let tdQuantidadeEstoque = document.createElement('td');
    let tdValor = document.createElement("td");
    let tdDataCadastro = document.createElement("td");
    let tdAcoes = document.createElement("td");

    //atualizar tds com base nos produtos
    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdQuantidadeEstoque.textContent = produto.quantidadeEstoque;
    tdValor.textContent = produto.valor;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-3">
                                Excluir
                        </button>`
    function editarTexto() {
        // Obtenha o elemento de texto
        var texto = document.getElementById("texto");

        // Permita que o usuário insira um novo texto
        var novoTexto = prompt("Digite o novo texto:");

        // Atualize o texto no elemento HTML
        texto.textContent = novoTexto;
    }


    //adicionando as td as tr

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdQuantidadeEstoque);
    tr.appendChild(tdValor);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    //adicionar tr a tabela
    tabelaProduto.appendChild(tr);
}

formModal.btnSalvar.addEventListener('click', () => {

    //pegar dados da tela modal e virar um produto
    let produto = obterProdutoDoModal();

    //campos obrigatorios

    if (!produto.validar()) {
        alert("Nome e Quantidade Estoque são OBRIGATÓRIOS!");
        return;
    }

    // adicionar na API
    adicionarProdutoNoBackend(produto);
});

function obterProdutoDoModal() {
    return new Produto({
        id: formModal.id.value,
        nome: formModal.nome.value,
        quantidadeEstoque: formModal.quantidadeEstoque.value,
        valor: formModal.valor.value,
        dataCadastro: (formModal.dataCadastro.value)
            ? new Date(formModal.dataCadastro.value).toISOString()
            : new Date().toISOString()
    });
}

function adicionarProdutoNoBackend(produto) {

    fetch(URL, {
        method: 'POST',
        headers: {
            Authorization: obterToken(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(response => {
            let novoProduto = new Produto(response);
            listaDeProdutos.push(novoProduto);

            popularTabela(listaDeProdutos);

            //fechar modal
            modalProduto.hide();
            alert(`Produto ${produto.nome}, foi cadastrado com sucesso!`)
        })
}

function limparModalProduto() {
    formModal.id.value = '';
    formModal.nome.value = '';
    formModal.quantidadeEstoque.value = '';
    formModal.valor.value = '';
    formModal.dataCadastro.value = '';
}

function excluirProduto(id) {
    let produto = listaDeProdutos.find(produto => produto.id == id);

    if (confirm("Deseja realmente excluir o produto" + produto.nome)) {
        excluirProdutoNoBackend(id);
    }
}

function excluirProdutoNoBackend(id) {
    fetch(`${URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: obterToken()
        }
    })
        .then(() => {
            removerProdutoDaLista(id);
            popularTabela(listaDeProdutos);
        })
}

function removerProdutoDaLista(id) {
    let indice = listaDeProdutos.findIndex(produto => produto.id == id);

    listaDeProdutos.splice(indice, 1);
}
