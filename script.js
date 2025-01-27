(function() {
    const inventoryTable = document.querySelector("#inventory-table tbody");
    const addProductForm = document.querySelector("#add-product-form");
    const productSelect = document.querySelector("#product-select");
    const newStockInput = document.querySelector("#new-stock");
    const updateStockForm = document.querySelector("#update-stock-form");
    const deleteProductSelect = document.querySelector("#delete-product-select");
    const deleteProductForm = document.querySelector("#delete-product-form");
    const supplierTable = document.querySelector("#supplier-table tbody");
    const addSupplierForm = document.querySelector("#add-supplier-form");
    const orderTable = document.querySelector("#order-table tbody");
    const createOrderForm = document.querySelector("#create-order-form");
    const orderProductSelect = document.querySelector("#order-product-select");
    const orderSupplierSelect = document.querySelector("#order-supplier-select");
    const orderQuantityInput = document.querySelector("#order-quantity");

    function init() {
        if (!localStorage.getItem('inventory')) {
            localStorage.setItem('inventory', JSON.stringify([]));
        }
        if (!localStorage.getItem('suppliers')) {
            localStorage.setItem('suppliers', JSON.stringify([]));
        }
        if (!localStorage.getItem('orders')) {
            localStorage.setItem('orders', JSON.stringify([]));
        }
        renderInventory();
        renderSuppliers();
        renderOrders();
    }

    function getInventory() {
        return JSON.parse(localStorage.getItem('inventory'));
    }

    function saveInventory(data) {
        localStorage.setItem('inventory', JSON.stringify(data));
    }

    function renderInventory() {
        const inventory = getInventory();
        inventoryTable.innerHTML = "";
        productSelect.innerHTML = "";
        deleteProductSelect.innerHTML = "";
        orderProductSelect.innerHTML = "";
        inventory.forEach((product) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.stock}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                    <button onclick="updateStock(${product.id})">Update Stock</button>
                </td>
            `;
            inventoryTable.appendChild(row);
            productSelect.innerHTML += `<option value="${product.id}">${product.name}</option>`;
            deleteProductSelect.innerHTML += `<option value="${product.id}">${product.name}</option>`;
            orderProductSelect.innerHTML += `<option value="${product.id}">${product.name}</option>`;
        });
    }

    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.querySelector("#product-name").value.trim();
        const stock = parseInt(document.querySelector("#product-stock").value, 10);
        const price = parseFloat(document.querySelector("#product-price").value);
        if (name && !isNaN(stock) && !isNaN(price)) {
            const inventory = getInventory();
            const newProduct = {
                id: inventory.length > 0 ? inventory[inventory.length - 1].id + 1 : 1,
                name,
                stock,
                price
            };
            inventory.push(newProduct);
            saveInventory(inventory);
            addProductForm.reset();
            renderInventory();
        } else {
            alert("Please enter valid product details.");
        }
    });

    window.updateStock = function(productId) {
        const newStock = prompt("Enter new stock value:");
        if (newStock !== null) {
            const stockValue = parseInt(newStock, 10);
            if (!isNaN(stockValue)) {
                const inventory = getInventory();
                const product = inventory.find(p => p.id === productId);
                if (product) {
                    product.stock = stockValue;
                    saveInventory(inventory);
                    renderInventory();
                } else {
                    alert("Product not found.");
                }
            } else {
                alert("Invalid stock value.");
            }
        }
    };

    deleteProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const productId = parseInt(deleteProductSelect.value, 10);
        if (!isNaN(productId)) {
            let inventory = getInventory();
            inventory = inventory.filter(p => p.id !== productId);
            saveInventory(inventory);
            let orders = getOrders();
            orders = orders.filter(o => o.product_id !== productId);
            saveOrders(orders);
            deleteProductForm.reset();
            renderInventory();
            renderOrders();
        } else {
            alert("Invalid product selected.");
        }
    });

    function getSuppliers() {
        return JSON.parse(localStorage.getItem('suppliers'));
    }

    function saveSuppliers(data) {
        localStorage.setItem('suppliers', JSON.stringify(data));
    }

    function renderSuppliers() {
        const suppliers = getSuppliers();
        supplierTable.innerHTML = "";
        orderSupplierSelect.innerHTML = "";
        suppliers.forEach((supplier) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.contact}</td>
            `;
            supplierTable.appendChild(row);
            orderSupplierSelect.innerHTML += `<option value="${supplier.id}">${supplier.name}</option>`;
        });
    }

    addSupplierForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.querySelector("#supplier-name").value.trim();
        const contact = document.querySelector("#supplier-contact").value.trim();
        if (name && contact) {
            const suppliers = getSuppliers();
            const newSupplier = {
                id: suppliers.length > 0 ? suppliers[suppliers.length - 1].id + 1 : 1,
                name,
                contact
            };
            suppliers.push(newSupplier);
            saveSuppliers(suppliers);
            addSupplierForm.reset();
            renderSuppliers();
        } else {
            alert("Please enter valid supplier details.");
        }
    });

    function getOrders() {
        return JSON.parse(localStorage.getItem('orders'));
    }

    function saveOrders(data) {
        localStorage.setItem('orders', JSON.stringify(data));
    }

    function renderOrders() {
        const orders = getOrders();
        orderTable.innerHTML = "";
        orders.forEach((order) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.product_name}</td>
                <td>${order.quantity}</td>
                <td>${order.supplier_name}</td>
                <td>
                    <button onclick="deleteOrder(${order.id})">Delete</button>
                </td>
            `;
            orderTable.appendChild(row);
        });
    }

    createOrderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const productId = parseInt(orderProductSelect.value, 10);
        const quantity = parseInt(document.querySelector("#order-quantity").value, 10);
        const supplierId = parseInt(orderSupplierSelect.value, 10);
        if (!isNaN(productId) && !isNaN(quantity) && !isNaN(supplierId)) {
            const inventory = getInventory();
            const suppliers = getSuppliers();
            const product = inventory.find(p => p.id === productId);
            const supplier = suppliers.find(s => s.id === supplierId);
            if (product && supplier) {
                if (product.stock >= quantity) {
                    const orders = getOrders();
                    const newOrder = {
                        id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
                        product_id: product.id,
                        product_name: product.name,
                        quantity,
                        supplier_id: supplier.id,
                        supplier_name: supplier.name
                    };
                    orders.push(newOrder);
                    saveOrders(orders);
                    product.stock -= quantity;
                    saveInventory(inventory);
                    createOrderForm.reset();
                    renderInventory();
                    renderOrders();
                } else {
                    alert("Insufficient stock for this order.");
                }
            } else {
                alert("Product or Supplier not found.");
            }
        } else {
            alert("Please enter valid order details.");
        }
    });

    window.deleteOrder = function(orderId) {
        const orders = getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            const order = orders[orderIndex];
            const inventory = getInventory();
            const product = inventory.find(p => p.id === order.product_id);
            if (product) {
                product.stock += order.quantity;
                saveInventory(inventory);
            }
            orders.splice(orderIndex, 1);
            saveOrders(orders);
            renderInventory();
            renderOrders();
        } else {
            alert("Order not found.");
        }
    };

    init();
})();
