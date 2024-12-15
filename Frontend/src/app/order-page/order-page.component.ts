interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  paymentMethod: string;
  shippingAddress: string;
  items: { name: string; quantity: number; price: string }[];
}

const orders: Order[] = [
  {
    id: "12345",
    date: "2024-12-01",
    status: "Delivered",
    total: "$99.99",
    paymentMethod: "Credit Card",
    shippingAddress: "123 Main St, City, Country",
    items: [
      { name: "Item A", quantity: 1, price: "$49.99" },
      { name: "Item B", quantity: 2, price: "$25.00" }
    ]
  },
  {
    id: "67890",
    date: "2024-12-10",
    status: "Pending",
    total: "$39.99",
    paymentMethod: "PayPal",
    shippingAddress: "456 Elm St, City, Country",
    items: [
      { name: "Item C", quantity: 1, price: "$39.99" }
    ]
  }
];

const orderHistoryTable = document.getElementById("order-history") as HTMLTableSectionElement;
const orderDetailsSection = document.getElementById("order-details-section") as HTMLElement;
const orderInfo = document.getElementById("order-info") as HTMLElement;
const backToOrdersButton = document.getElementById("back-to-orders") as HTMLButtonElement;
const filterStatus = document.getElementById("filter-status") as HTMLSelectElement;
const filterDate = document.getElementById("filter-date") as HTMLInputElement;
const applyFilterButton = document.getElementById("apply-filter") as HTMLButtonElement;

function displayOrders(filteredOrders: Order[]): void {
  orderHistoryTable.innerHTML = "";
  filteredOrders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.date}</td>
      <td>${order.status}</td>
      <td>${order.total}</td>
      <td>${order.paymentMethod}</td>
      <td>${order.shippingAddress}</td>
      <td><button class="view-details" data-id="${order.id}">View Details</button></td>
    `;
    orderHistoryTable.appendChild(row);
  });
}

displayOrders(orders);

document.body.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains("view-details")) {
    const orderId = target.getAttribute("data-id");
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      showOrderDetails(order);
    }
  }
});

function showOrderDetails(order: Order): void {
  orderInfo.innerHTML = `
    <h3>Order ID: ${order.id}</h3>
    <p>Date: ${order.date}</p>
    <p>Status: ${order.status}</p>
    <p>Total: ${order.total}</p>
    <p>Payment Method: ${order.paymentMethod}</p>
    <p>Shipping Address: ${order.shippingAddress}</p>
    <h4>Items:</h4>
    <ul>
      ${order.items.map((item) => `<li>${item.name} - Quantity: ${item.quantity} - Price: ${item.price}</li>`).join("")}
    </ul>
  `;
  orderDetailsSection.classList.remove("hidden");
  orderHistoryTable.parentElement!.classList.add("hidden");
}

backToOrdersButton.addEventListener("click", () => {
  orderDetailsSection.classList.add("hidden");
  orderHistoryTable.parentElement!.classList.remove("hidden");
});

applyFilterButton.addEventListener("click", () => {
  const statusFilter = filterStatus.value;
  const dateFilter = filterDate.value;
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = !dateFilter || order.date === dateFilter;
    return matchesStatus && matchesDate;
  });
  displayOrders(filteredOrders);
});
