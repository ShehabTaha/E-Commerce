// Sign In
const signInEmail = document.getElementById("sign-in-email");
const signInPassword = document.getElementById("sign-in-password");
const signinNamecheck = localStorage.getItem("name");
const signInEmailCheck = localStorage.getItem("email");
const signInPasswordCheck = localStorage.getItem("password");
let isSignInValid = false;
let emailregEx = /[\w+]@[a-zA-Z]+\.[a-zA-Z]+/;

if (localStorage.getItem("isSignInValid") === "true") {
  document.querySelector(".main").style.display = "block";
  document.getElementById("nav-links").style.display = "flex";
  document.querySelector(".signin").style.display = "none";
}

let inputs = document.querySelectorAll(".form input");

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value !== "") {
      document
        .querySelector(`label[for=${input.id}]`)
        .classList.add("not-empty");
    } else {
      document
        .querySelector(`label[for=${input.id}]`)
        .classList.remove("not-empty");
    }
  });
});

const signInBtn = document.getElementById("sign-in-submit");
signInBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    emailregEx.test(signInEmail.value) &&
    signInEmail.value === signInEmailCheck &&
    signInPassword.value === signInPasswordCheck
  ) {
    console.log("Sign In Successful");
    isSignInValid = true;
    localStorage.setItem("isSignInValid", isSignInValid);
    document.querySelector(".main").style.display = "block";
    document.getElementById("nav-links").style.display = "flex";
    document.querySelector(".signin").style.display = "none";
  } else {
    document.getElementById("sign-in-error").style.display = "block";
    console.log("Sign In Failed");
  }
});

// Sign Up
const signUpName = document.getElementById("sign-up-name");
const signUpEmail = document.getElementById("sign-up-email");
const signUpPassword = document.getElementById("sign-up-password");
const signUpBtn = document.getElementById("sign-up-submit");
signUpBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    signUpName.value === "" ||
    signUpEmail.value === "" ||
    signUpPassword.value === "" ||
    !emailregEx.test(signUpEmail.value)
  ) {
    document.getElementById("invalid-error").style.display = "block";
  } else if (
    signUpName.value === signinNamecheck ||
    signUpEmail.value === signInEmailCheck
  ) {
    document.getElementById("sign-up-error").style.display = "block";
  } else {
    localStorage.setItem("name", signUpName.value);
    localStorage.setItem("email", signUpEmail.value);
    localStorage.setItem("password", signUpPassword.value);
    document.querySelector(".signup").style.display = "none";
    document.querySelector(".signin").style.display = "flex";
  }
});

// Toggle Sign In/Sign Up
const reg = document.getElementById("re");
reg.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".signin").style.display = "none";
  document.querySelector(".signup").style.display = "flex";
});

// add items to main page
async function fetchProducts() {
  try {
    let response = await fetch("info.json");
    let data = await response.json();
    displayProducts(data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function saveToCart(product, quantity) {
  localStorage.setItem(
    `cartItem${product.id}`,
    JSON.stringify({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      description: product.description,
      quantity: Number(quantity),
    })
  );
}

function renderCart() {
  const cartContainer = document.querySelector(".cart-items");
  cartContainer.innerHTML = "";

  let keys = Object.keys(localStorage).filter((k) => k.startsWith("cartItem"));
  let total = 0;

  keys.forEach((key) => {
    let item = JSON.parse(localStorage.getItem(key));
    total += item.price * item.quantity;

    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="info">
        <h3 class="title">${item.name}</h3>
        <p class="description">${item.description}</p>
        <p class="product-price">$${item.price}</p>
      </div>
      <p class="quantity">Quantity: ${item.quantity}</p>
      <button class="btn remove-from-cart" data-id="${item.id}">Remove</button>
    `;
    cartContainer.appendChild(cartItem);
  });

  document.querySelector(".cart-total p").innerText = `Total Price: $${total}`;
}

function displayProducts(products) {
  products.forEach((product) => {
    let productCard = document.createElement("div");
    productCard.classList.add("card");
    productCard.innerHTML = `
      <img src="${product.img}" alt="${product.name}" />
      <div class="info">
        <h3 class="title">${product.name}</h3>
        <p class="description">${product.description}</p>
        <p class="product-price">$${product.price}</p>
        <input type="number" class="quantity" id="${product.id}-quantity" min="1" value="1" />
      </div>
      <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    document
      .querySelector("#products-list .container")
      .appendChild(productCard);
  });

  setupAddToCart(products);
}

function setupAddToCart(products) {
  document.querySelectorAll(".add-to-cart").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      let quantity =
        btn.previousElementSibling.querySelector(".quantity").value;
      saveToCart(products[i], quantity);
      renderCart();
      document.querySelector(".popup").style.display = "block";
      document.querySelector(".main").style.opacity = "0.5";
    });
  });
}

// remove items from cart with delegation
document.querySelector(".cart-items").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-from-cart")) {
    const id = e.target.dataset.id;
    localStorage.removeItem(`cartItem${id}`);
    renderCart();
  }
});

// checkout
document.querySelector(".checkout").addEventListener("click", () => {
  let keys = Object.keys(localStorage).filter((k) => k.startsWith("cartItem"));
  keys.forEach((key) => {
    localStorage.removeItem(key);
  });
  renderCart();
});

document.getElementById("back-to-products").addEventListener("click", () => {
  document.querySelector(".main").style.display = "block";
  document.querySelector(".cart").style.display = "none";
});

document.getElementById("back-to-cart").addEventListener("click", () => {
  document.querySelector(".main").style.display = "none";
  document.querySelector(".cart").style.display = "block";
});

document.getElementById("back-to-signin").addEventListener("click", () => {
  localStorage.setItem("isSignInValid", "false");
  document.querySelector(".main").style.display = "none";
  document.getElementById("nav-links").style.display = "none";
  document.querySelector(".signin").style.display = "flex";
});

fetchProducts();
