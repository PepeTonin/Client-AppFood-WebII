// MÉTODO GET GENÉRICO
async function getDadosApi(url) {
    const response = await fetch(url);
    return response.json();
};

// CONFIGURAÇÃO DAS TABS
const tabs = document.querySelectorAll(".tabs_wrap ul li");
const categoria = document.querySelectorAll(".categoria");
const produto = document.querySelectorAll(".produto");
const all = document.querySelectorAll(".item_wrap");
const listaCategorias = document.querySelector("select");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        tab.classList.add("active");
        const tabval = tab.getAttribute("data-tabs");

        all.forEach((item) => {
            item.style.display = "none";
        })

        if (tabval == "categoria") {
            categoria.forEach((item) => {
                item.style.display = "block";
            })
        }
        else {
            produto.forEach((item) => {
                item.style.display = "block";
            })

            // CARREGA AS CATEGORIAS NA TAG SELECT DO HTML
            getDadosApi("http://localhost:3000/categories").then((categorias) => {
                // REMOVE AS TAG OPTIONS EXISTENTES
                const opcoesListaCategorias = document.querySelectorAll("option");
                if (opcoesListaCategorias.length > 0) {
                    opcoesListaCategorias.forEach((opcao) => {
                        listaCategorias.removeChild(opcao);
                    })
                }
                // PREENCHE A TAG SELECT COM AS CATEGORIAS BUSCADAS NA API
                categorias.forEach((categoria) => {
                    let option = document.createElement("option");
                    option.setAttribute('value', categoria["name"]);

                    let optionText = document.createTextNode(categoria["name"]);
                    option.appendChild(optionText);

                    listaCategorias.appendChild(option);
                })
            })
        }
    })
});
// FIM DA CONFIGURAÇÃO DAS TABS


// EVENT LISTENER CLICK DO BOTÃO DE CADASTRAR CATEGORIA
document.getElementById("enviarCategoria").addEventListener("click", () => {

    const inputNomeCategoria = document.getElementById("nomeCategoria");
    const inputIconeCategoria = document.getElementById("iconeCategoria")

    const dados = {
        name: inputNomeCategoria.value,
        icon: inputIconeCategoria.value
    };

    fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados)
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        })

    inputNomeCategoria.value = "";
    inputIconeCategoria.value = "";

});
// FIM DO EVENT LISTENER DO BOTÃO DE CADASTRAR CATEGORIA


// EVENT LISTENER CLICK DO BOTÃO DE CADASTRAR PRODUTO
document.getElementById("enviarProduto").addEventListener("click", () => {

    const inputNomeProduto = document.getElementById("nomeProduto");
    const inputDescProduto = document.getElementById("descricaoProduto");
    const inputImagemProduto = document.getElementById("imagemProduto");
    const inputPrecoProduto = document.getElementById("precoProduto");
    const selectCategoriaProduto = document.getElementById("categoriaProduto");

    const nomeCategoriaProduto = selectCategoriaProduto.value;

    getDadosApi("http://localhost:3000/categories").then((categorias) => {

        categorias.forEach((categoria) => {

            if (categoria["name"] === nomeCategoriaProduto) {

                const idCategoriaProduto = categoria["_id"];
                const nomeProduto = inputNomeProduto.value;
                const descricaoProduto = inputDescProduto.value;
                const imagemProduto = inputImagemProduto.files[0];
                const precoProduto = Number(inputPrecoProduto.value);

                const formData = new FormData();

                formData.append("name", nomeProduto);
                formData.append("description", descricaoProduto);
                formData.append("image", imagemProduto);
                formData.append("price", precoProduto);
                formData.append("category", idCategoriaProduto);

                fetch("http://localhost:3000/products", {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })

                inputNomeProduto.value = "";
                inputDescProduto.value = "";
                inputImagemProduto.value = "";
                inputPrecoProduto.value = "";
            }
        })
    })
});
// FIM DO EVENT LISTENER DO BOTÃO DE CADASTRAR PRODUTO
