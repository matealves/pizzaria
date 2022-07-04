const cS = (elemento) => {
  return document.querySelector(elemento); //"cS" vai retornar o querySelector p/ passar cada elemento como parâmetro
};
const cSAll = (elemento) => {
  return document.querySelectorAll(elemento); //"cSAll" = querySelectorAll p/ passar elemento como parâmetro
};

let cart = [];
let modalQt = 1;
let modalKey = 0;

//##LIST PIZZAS
pizzaJson.map((item, index) => {
  //Mapear todos os objetos do JSON
  let pizzaItem = cS(".models .pizza-item").cloneNode(true); //cloneNode() = Clona o elemento selecionado com a qtd do JSON
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

    cS(".pizzaBig img").src = pizzaJson[key].img;
    cS(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    cS(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    cS(".pizzaInfo--actualPrice").innerHTML = `${pizzaJson[
      key
    ].price[2].toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    })}`;
    cS(".pizzaInfo--size.selected").classList.remove("selected"); //reset no tamanho da pizza
    cSAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      //forEach() = Para cada;
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];

      size.addEventListener("click", () => {
        //Altera a cor do botão ao clicar
        cS(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
        //Altera o valor conforme o tamanho + moeda REAL R$
        cS(".pizzaInfo--actualPrice").innerHTML = ` ${pizzaJson[key].price[
          sizeIndex
        ].toLocaleString("pt-br", { style: "currency", currency: "BRL" })}`;
      });
    });

    cS(".pizzaInfo--qt").innerHTML = modalQt;

    cS(".pizzaWindowArea").style.opacity = 0;
    cS(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      cS(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  cS(".pizza-area").append(pizzaItem); //append() mantém o elemento e adiciona outro em seguida. appendChild() precisa de um elemento pai para inserir dentro
});

//##MODAL EVENTS
function closeModal() {
  cS(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    cS(".pizzaWindowArea").style.display = "none";
  }, 600);
  window.scrollTo(0, 0);
}

cSAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

//##CONTROLS
cS(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    cS(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
cS(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  cS(".pizzaInfo--qt").innerHTML = modalQt;
});

cSAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    cS(".pizzaInfo--size.selected").classList.remove("selected"); // reset tamanho selecionado
    size.classList.add("selected");
  });
});

//##ADD TO CART
cS(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(cS(".pizzaInfo--size.selected").getAttribute("data-key"));
  let identifier = pizzaJson[modalKey].id + "@" + size; //concatena id da pizza e tamanho
  let keyItem = cart.findIndex((item) => item.identifier == identifier); //return
  if (keyItem > -1) {
    cart[keyItem].qtd += modalQt; // aumenta a qtd caso item já esteja no cart
  } else {
    //## Adicionando objeto na variável "cart".
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      price: pizzaJson[modalKey].price[size],
      qtd: modalQt,
    });
  }
  updateCart();
  closeModal();
});

cS(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    cS("aside").style.left = 0;
  }
});

cS(".menu-closer").addEventListener("click", () => {
  cS("aside").style.left = "100vw";
});

function updateCart() {
  cS(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    cS("aside").classList.add("show");
    cS(".cart").innerHTML = ""; //Limpar carrinho

    let subtotal = 0;
    let entrega = 5;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += cart[i].price * cart[i].qtd;

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      let cartItem = cS(".models .cart--item").cloneNode(true);

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qtd;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qtd > 1) {
            cart[i].qtd--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qtd++;
          updateCart();
        });

      cS(".cart").append(cartItem);
    }

    subtotal += entrega;
    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    cS(".entrega span:last-child").innerHTML = `${entrega.toLocaleString(
      "pt-br",
      { style: "currency", currency: "BRL" }
    )}`;
    cS(".subtotal span:last-child").innerHTML = `${subtotal.toLocaleString(
      "pt-br",
      { style: "currency", currency: "BRL" }
    )}`;
    cS(".desconto span:last-child").innerHTML = `${desconto.toLocaleString(
      "pt-br",
      { style: "currency", currency: "BRL" }
    )}`;
    cS(".total span:last-child").innerHTML = `${total.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    })}`;
  } else {
    cS("aside").classList.remove("show"); //Closet cart
    cS("aside").style.left = "100vw";
  }
}

cS(".cart--finalizar").addEventListener("click", () => {
  cart = [];
  updateCart();
  cS(".success.pizzaWindowArea").style.opacity = 0;
  cS(".success.pizzaWindowArea").style.display = "flex";
  setTimeout(() => {
    cS(".success.pizzaWindowArea").style.opacity = 1;
  }, 200);
  cS(".success.pizzaWindowArea").style.display = "flex";

  setTimeout(() => {
    cS(".success.pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
      cS(".success.pizzaWindowArea").style.display = "none";
      updateCart();
      closeModal();
    }, 200);
  }, 4000);
  
});
