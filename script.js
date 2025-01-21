
let inventory = [];

const inventoryTable = document.querySelector("#inventory-table tbody");
const addProductForm = document.querySelector("#add-product-form");
const productNameInput = document.querySelector("#product-name");
const productStockInput = document.querySelector("#product-stock");
const productPriceInput = document.querySelector("#product-price");

function renderInventory() {
  inventoryTable.innerHTML = ""; // Clear current rows
  inventory.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.stock}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>
        <button onclick="updateStock(${index})">Update Stock</button>
      </td>
    `;
    inventoryTable.appendChild(row);
  });
}

addProductForm.addEventListener("submit", (event) => {
  event.preventDefault();
 
  const name = productNameInput.value.trim();
  const stock = parseInt(productStockInput.value.trim(), 10);
  const price = parseFloat(productPriceInput.value.trim());
  if (name && !isNaN(stock) && !isNaN(price)) {
    inventory.push({ name, stock, price });
    renderInventory();
    addProductForm.reset();
  } else {
    alert("Please enter valid product details.");
  }
});

function updateStock(index) {
  const newStock = prompt(
    `Enter new stock for ${inventory[index].name}:`,
    inventory[index].stock
  );
  if (newStock !== null && !isNaN(newStock)) {
    inventory[index].stock = parseInt(newStock, 10);
    renderInventory();
  }
}

renderInventory();
