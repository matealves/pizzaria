let header = document.querySelector(".header");
header = header.innerHTML = `<div class="menu-area">
    <div class="logo">
        <a href="index.html">
            <img src="images/logo_pizza.png" alt="logo_pizza.png">
        </a>
    </div>
    <nav>
        <div class="container-menu-mobile">
            <div class="menuMobile-area">
                <div class="menu-openner"><span>0</span>
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>
            </div>
            <label for="checkbox" class="menu_hamburger">
                <input type="checkbox" id="checkbox">
                <span class="line line-main"></span>
                <span class="line line-split"></span>
            </label>
        </div>
        <div class="menu">
            <ul>
                <a href="index.html">
                    <li>Início</li>
                </a>
                <a href="menu.html">
                    <li>Pizzas</li>
                </a>
                <a href="https://github.com/matealves" target="_blank">
                    <li>Sobre</li>
                </a>
                <a href="https://www.linkedin.com/in/mateusalvesds/" target="_blank">
                    <li>Contato</li>
                </a>
            </ul>
        </div>
    </nav>
</div>`;

let activePage = window.location.pathname;
let navLinks = document.querySelectorAll("nav .menu a").forEach((link) => {
  if (link.href.includes(`${activePage}`)) {
    link.classList.add("active");
  }
});

let toggleMenu = document.querySelector("#checkbox");
let openMenu = document.querySelector(".menu");

toggleMenu.addEventListener("click", () => {
  openMenu.classList.toggle("menu-opened");
});
