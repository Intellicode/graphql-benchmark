const fs = require("fs");
const path = require("path");

// Mock data
const users = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i < 10 ? "ADMIN" : "CUSTOMER",
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
  updatedAt: new Date(
    Date.now() - Math.floor(Math.random() * 1000000000)
  ).toISOString(),
}));

const categories = Array.from({ length: 10 }, (_, i) => ({
  id: `category-${i + 1}`,
  name: `Category ${i + 1}`,
}));

const products = Array.from({ length: 1000 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  description: `This is the description for product ${
    i + 1
  }. It contains detailed information about the product.`,
  price: Math.floor(Math.random() * 100000) / 100,
  inventory: Math.floor(Math.random() * 1000),
  categoryId: `category-${Math.floor(Math.random() * 10) + 1}`,
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
  updatedAt: new Date(
    Date.now() - Math.floor(Math.random() * 1000000000)
  ).toISOString(),
}));

const reviews = Array.from({ length: 5000 }, (_, i) => ({
  id: `review-${i + 1}`,
  rating: Math.floor(Math.random() * 5) + 1,
  comment:
    Math.random() > 0.2
      ? `This is review ${i + 1} with some feedback about the product.`
      : null,
  userId: `user-${Math.floor(Math.random() * 100) + 1}`,
  productId: `product-${Math.floor(Math.random() * 1000) + 1}`,
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
}));

const orders = Array.from({ length: 2000 }, (_, i) => {
  const itemCount = Math.floor(Math.random() * 5) + 1;
  const items = Array.from({ length: itemCount }, (_, j) => {
    const productId = `product-${Math.floor(Math.random() * 1000) + 1}`;
    const product = products.find((p) => p.id === productId);
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = product.price;
    return {
      id: `order-item-${i}-${j}`,
      productId,
      quantity,
      price,
    };
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const statuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return {
    id: `order-${i + 1}`,
    userId: `user-${Math.floor(Math.random() * 100) + 1}`,
    items,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    total,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - Math.floor(Math.random() * 1000000000)
    ).toISOString(),
  };
});

const outputDir = path.join(__dirname, "mock-data");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(
  path.join(outputDir, "users.json"),
  JSON.stringify(users, null, 2)
);
fs.writeFileSync(
  path.join(outputDir, "categories.json"),
  JSON.stringify(categories, null, 2)
);
fs.writeFileSync(
  path.join(outputDir, "products.json"),
  JSON.stringify(products, null, 2)
);
fs.writeFileSync(
  path.join(outputDir, "reviews.json"),
  JSON.stringify(reviews, null, 2)
);
fs.writeFileSync(
  path.join(outputDir, "orders.json"),
  JSON.stringify(orders, null, 2)
);

console.log(
  'Mock data has been written to JSON files in the "mock-data" directory.'
);
