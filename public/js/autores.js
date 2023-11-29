function displayAutores(autores) {
    const tbody = document.getElementById("listaAutores");
    tbody.innerHTML = ""; // Limpar a tabela

    autores.forEach(autor => {
        const row = tbody.insertRow();

        const nomeCell = row.insertCell(0);
        nomeCell.textContent = autor.titulo;

        const biografiaCell = row.insertCell(1);
        biografiaCell.textContent = autor.autor;

        const dataCell = row.insertCell(2);
        dataCell.textContent = new Date(autor.dataPublicacao).toLocaleDateString();

        const actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `<button class="icon-btn" onclick='editarAutores(${JSON.stringify(autores)})'>
        <i class="fas fa-edit"></i> Editar
    </button>
    <button class="icon-btn" onclick="deleteAutores(${autor.id})">
    <i class="fas fa-trash"></i> Excluir
    </button>`;
    });
}

function fetchAutores() {
    fetch("/api/autores")
        .then(res => res.json())
        .then(data => {
            displayAutores(data);
        })
        .catch(error => {
            console.error("Erro ao buscar autores:", error);
        });
}

function deleteAutores(id) {
    fetch(`/api/autores/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        fetchAutores();
    })
    .catch(error => {
        console.error("Erro ao deletar autores:", error);
    });
}

function editarAutores(autores) {
    const addAutorBtn = document.getElementById("addAutorBtn");
    const nome = document.getElementById("nome");
    const biografia = document.getElementById("biografia");
    const dataPublicacao = document.getElementById("dataPublicacao");
    const livroId= document.getElementById("id_livro");
    nome.value = autor.nome;
    biografia.value = autor.biografia;
    dataDeNascimento.value = new Date(autor.dataDeNascimento).toISOString().split('T')[0];
    autorId.value = autor.id;
    addAutorBtn.click();
/**/
}

function limparFormulario(){
    const nome = document.getElementById("nome");
    const biografia = document.getElementById("biografia");
    const dataDeNascimento = document.getElementById("dataDeNascimento");
    const autorId= document.getElementById("id_autor");

    nome.value = "";
    biografia.value = "";
    dataDeNascimento.value = "";
    autorId.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "/api/autores";
    const autorForm = document.getElementById("autorForm");
    const autorPopup = document.getElementById("autorPopup");
    const addAutorBtn = document.getElementById("addAutorBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Carregar livros ao carregar a página
    fetchAutores()

    // Mostrar popup ao clicar no botão "Adicionar Livro"
    addAutorBtn.addEventListener("click", function() {
        autorPopup.classList.add("show");
        autorPopup.classList.remove("hidden");
    });

    // Fechar popup
    closePopupBtn.addEventListener("click", function() {
        autorPopup.classList.add("hidden");
        autorPopup.classList.remove("show");
        limparFormulario();
    });

    // Adicionar novo livro ou atualizar um existente
    autorForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const biografia = document.getElementById("biografia").value;
        const dataDeNascimento = document.getElementById("dataDeNascimento").value;
        const autorId= document.getElementById("id_autor").value;

        let methodSalvar = "POST";
        let apiUrlSalvar = apiUrl;
        if(autorId != "" && autorId > 0){
            methodSalvar = "PUT";
            apiUrlSalvar += "/" + autorId;
        }
    
        fetch(apiUrlSalvar, {
            method: methodSalvar,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, biografia, dataDeNascimento })
        })
        .then(res => {
            if (res.ok && res.status == "201") return res.json();
            else if (res.ok && res.status == "204") return;
            throw new Error(res.statusText);
        })
        .then(data => {
            fetchAutores();
            limparFormulario();
            closePopupBtn.click();
        })
        .catch(error => {
            console.error("Erro ao adicionar/atualizar autores:", error);
        });
    
    });
});