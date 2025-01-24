const BASE_URL = "https://vedantsaran.github.io/InventoryMaster/"; 

const inventoryTable = document.querySelector("#inventory-table tbody");
const supplierTable = document.querySelector("#supplier-table tbody");
const orderTable = document.querySelector("#order-table tbody");
const addProductForm = document.querySelector("#add-product-form");
const addSupplierForm = document.querySelector("#add-supplier-form");
const createOrderForm = document.querySelector("#create-order-form");
const productSelect = document.querySelector("#product-select");
const deleteProductSelect = document.querySelector("#delete-product-select");
const orderProductSelect = document.querySelector("#order-product-select");
const orderSupplierSelect = document.querySelector("#order-supplier-select");

async function fetchData(endpoint) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  return response.json();
}

async function renderInventory() {
  const inventory = await fetchData("inventory");
  inventoryTable.innerHTML = "";
  productSelect.innerHTML = "";
  deleteProductSelect.innerHTML = "";
  inventory.forEach(product => {
    const row = `
      <tr>
        <td>${product.name}</td>
        <td>${product.stock}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>
          <button onclick="updateStock(${product.id})">Update Stock</button>
        </td>
      </tr>
    `;
    inventoryTable.innerHTML += row;
    productSelect.innerHTML += `<option value="${product.id}">${product.name}</option>`;
    deleteProductSelect.innerHTML += `<option value="${product.id}">${product.name}</option>`;
  });
}

async function renderSuppliers() {
  const suppliers = await fetchData("suppliers");
  supplierTable.innerHTML = "";
  orderSupplierSelect.innerHTML = "";
  suppliers.forEach(supplier => {
    const row = `
      <tr>
        <td>${supplier.name}</td>
        <td>${supplier.contact}</td>
      </tr>
    `;
    supplierTable.innerHTML += row;
    orderSupplierSelect.innerHTML += `<option value="${supplier.id}">${supplier.name}</option>`;
  });
}

async function renderOrders() {
  const orders = await fetchData("orders");
  orderTable.innerHTML = "";
  orders.forEach(order => {
    const row = `
      <tr>
        <td>${order.id}</td>
        <td>${order.product_name}</td>
        <td>${order.quantity}</td>
        <td>${order.supplier_name}</td>
        <td>
          <button onclick="deleteOrder(${order.id})">Delete</button>
        </td>
      </tr>
    `;
    orderTable.innerHTML += row;
  });
}

addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#product-name").value;
  const stock = document.querySelector("#product-stock").value;
  const price = document.querySelector("#product-price").value;
  await fetch(`${BASE_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, stock, price }),
  });
  renderInventory();
  addProductForm.reset();
});

addSupplierForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#supplier-name").value;
  const contact = document.querySelector("#supplier-contact").value;
  await fetch(`${BASE_URL}/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, contact }),
  });
  renderSuppliers();
  addSupplierForm.reset();
});

createOrderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const productId = document.querySelector("#order-product-select").value;
  const quantity = document.querySelector("#order-quantity").value;
  const supplierId = document.querySelector("#order-supplier-select").value;
  await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity, supplier_id: supplierId }),
  });
  renderOrders();
  createOrderForm.reset();
});

renderInventory();
renderSuppliers();
renderOrders();

