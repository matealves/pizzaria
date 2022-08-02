let cart = [];
let modalQt = 1;
let modalKey = 0;
let pizzas;

// GET CART BY SESSION STORAGE
localStorage.getItem("pizza_cart")
  ? (cart = JSON.parse(localStorage.getItem("pizza_cart")))
  : (cart = []);

const api = fetch("https://matealves.github.io/pizzaria/apiData.json")
  .then(async (response) => await response.json())
  .then((data) => {
    pizzas = data;

    updateCart();

    //##LIST PIZZAS
    data.map((item, index) => {
      //Mapear todos os objetos do JSON
      let pizzaItem = document
        .querySelector(".models .pizza-item")
        .cloneNode(true); //cloneNode() = Clona o elemento selecionado com a qtd do JSON
      pizzaItem.setAttribute("data-key", index); // colocando atributo e valor

      pizzaItem.querySelector(".pizza-item--img img").src = item.img;
      pizzaItem.querySelector(
        ".pizza-item--price"
      ).innerHTML = `${item.price[2].toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      })}`;
      pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
      pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

      //### MODAL
      pizzaItem.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault(); //Previna a ação padrão.
        let key = e.target.closest(".pizza-item").getAttribute("data-key"); //target.closest() procura elemento mais próximo que contenha... Quando clicar, PEGAR o atributo data-key
        modalQt = 1; // reset quantidade de pizzas ao abrir modal
        modalKey = key; // Diz qual a pizza aberta no modal

        document.querySelector(".pizzaBig img").src = pizzas[key].img;
        document.querySelector(".pizzaInfo h1").innerHTML = pizzas[key].name;
        document.querySelector(".pizzaInfo--desc").innerHTML =
          pizzas[key].description;
        document.querySelector(".pizzaInfo--actualPrice").innerHTML = `${pizzas[
          key
        ].price[2].toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}`;
        document
          .querySelector(".pizzaInfo--size.selected")
          .classList.remove("selected"); //reset no tamanho da pizza
        document
          .querySelectorAll(".pizzaInfo--size")
          .forEach((size, sizeIndex) => {
            //forEach() = Para cada;
            if (sizeIndex == 2) {
              size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzas[key].sizes[sizeIndex];

            size.addEventListener("click", () => {
              //Altera a cor do botão ao clicar
              document
                .querySelector(".pizzaInfo--size.selected")
                .classList.remove("selected");
              size.classList.add("selected");
              //Altera o valor conforme o tamanho + moeda REAL R$
              modalQt = 1;
              document.querySelector(".pizzaInfo--qt").innerHTML = modalQt;
              document.querySelector(
                ".pizzaInfo--actualPrice"
              ).innerHTML = ` ${pizzas[key].price[sizeIndex].toLocaleString(
                "pt-br",
                { style: "currency", currency: "BRL" }
              )}`;
            });
          });

        document.querySelector(".pizzaInfo--qt").innerHTML = modalQt;

        document.querySelector(".pizzaWindowArea").style.opacity = 0;
        document.querySelector(".pizzaWindowArea").style.display = "flex";
        setTimeout(() => {
          document.querySelector(".pizzaWindowArea").style.opacity = 1;
        }, 200);
      });

      document.querySelector(".pizza-area").append(pizzaItem); //append() mantém o elemento e adiciona outro em seguida. appendChild() precisa de um elemento pai para inserir dentro
    });
  });

//##MODAL EVENTS
function closeModal() {
  document.querySelector(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    document.querySelector(".pizzaWindowArea").style.display = "none";
  }, 600);
  window.scrollTo(0, 0);
}
//Fechar modal com Esc
document.addEventListener("keydown", (event) => {
  const isEscKey = event.key === "Escape";

  if (
    (document.querySelector(".pizzaWindowArea").style.opacity = 1 && isEscKey)
  ) {
    closeModal();
  }
});
//Fechar modal com click no 'cancelar'
document
  .querySelectorAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton")
  .forEach((item) => {
    item.addEventListener("click", closeModal);
  });

//##CONTROLS
document.querySelector(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    let size = parseInt(
      document
        .querySelector(".pizzaInfo--size.selected")
        .getAttribute("data-key")
    );
    let preco = pizzas[modalKey].price[size];
    modalQt--;
    document.querySelector(".pizzaInfo--qt").innerHTML = modalQt;
    let updatePreco = preco * modalQt;
    document.querySelector(
      ".pizzaInfo--actualPrice"
    ).innerHTML = `${updatePreco.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    })}`;
  }
});
document.querySelector(".pizzaInfo--qtmais").addEventListener("click", () => {
  let size = parseInt(
    document.querySelector(".pizzaInfo--size.selected").getAttribute("data-key")
  );
  let preco = pizzas[modalKey].price[size];
  modalQt++;
  document.querySelector(".pizzaInfo--qt").innerHTML = modalQt;
  let updatePreco = preco * modalQt;
  document.querySelector(
    ".pizzaInfo--actualPrice"
  ).innerHTML = `${updatePreco.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  })}`;
});

document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    document
      .querySelector(".pizzaInfo--size.selected")
      .classList.remove("selected"); // reset tamanho selecionado
    size.classList.add("selected");
  });
});
