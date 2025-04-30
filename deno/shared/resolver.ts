import users from "../../mock-data/users.json" with { type: "json" };
import products from "../../mock-data/products.json" with { type: "json" };
import categories from "../../mock-data/categories.json" with { type: "json" };
import reviews from "../../mock-data/reviews.json" with { type: "json" };
import orders from "../../mock-data/orders.json" with { type: "json" };
import { randomDelay, scaledDelay } from "./utils";

export const resolvers =  {
      Query: {
      user: async (_, { id }) => {
        await randomDelay(20, 30); // Simulate single record lookup
        return users.find((user) => user.id === id);
      },
      users: async (_, { limit = 10, offset = 0 }) => {
        const result = users.slice(offset, offset + limit);
        await scaledDelay(result, 5, 15); // Delay scales with result size
        return result;
      },
      product: async (_, { id }) => {
        await randomDelay(25, 40); // Products might be more complex to fetch
        return products.find((product) => product.id === id);
      },
      products: async (
        _,
        { search, categoryId, minPrice, maxPrice, limit = 10, offset = 0 }
      ) => {
        // Simulate complex query processing time
        if (search) await randomDelay(40, 60); // Search is more expensive

        let filtered = [...products];

        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(searchLower) ||
              (p.description &&
                p.description.toLowerCase().includes(searchLower))
          );
        }

        if (categoryId) {
          filtered = filtered.filter((p) => p.categoryId === categoryId);
        }

        if (minPrice !== undefined) {
          filtered = filtered.filter((p) => p.price >= minPrice);
        }

        if (maxPrice !== undefined) {
          filtered = filtered.filter((p) => p.price <= maxPrice);
        }

        const result = filtered.slice(offset, offset + limit);
        await scaledDelay(result, 3, 10); // Final result processing
        return result;
      },
      categories: async () => {
        await randomDelay(15, 20); // Categories are typically small and cached
        return categories;
      },
      order: async (_, { id }) => {
        await randomDelay(30, 40); // Orders have complex relationships
        return orders.find((order) => order.id === id);
      },
      orders: async (_, { userId, status, limit = 10, offset = 0 }) => {
        // Orders query with filters simulation
        await randomDelay(25, 30);

        let filtered = orders.filter((order) => order.userId === userId);

        if (status) {
          filtered = filtered.filter((order) => order.status === status);
        }

        const result = filtered.slice(offset, offset + limit);
        await scaledDelay(result, 5, 10);
        return result;
      },
      topProducts: async (_, { limit = 5 }) => {
        // This is an analytics query - typically slow
        await randomDelay(60, 80);

        // Simulate "top" products by taking ones with most reviews
        const productReviewCounts = products.map((product) => {
          const reviewCount = reviews.filter(
            (r) => r.productId === product.id
          ).length;
          return { ...product, reviewCount };
        });

        return productReviewCounts
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, limit);
      },
      recentReviews: async (_, { limit = 10 }) => {
        await randomDelay(30, 40);
        return [...reviews]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit);
      },
    },

    Mutation: {
      createUser: async (_, { name, email, role }) => {
        await randomDelay(30, 50); // Creating a user takes some time
        const newUser = {
          id: `user-${users.length + 1}`,
          name,
          email,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        users.push(newUser);
        return newUser;
      },

      updateUser: async (_, { id, name, email, role }) => {
        await randomDelay(25, 40);
        const user = users.find((u) => u.id === id);
        if (!user) throw new Error(`User with ID ${id} not found`);

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (role !== undefined) user.role = role;
        user.updatedAt = new Date().toISOString();

        return user;
      },

      createProduct: async (
        _,
        { name, description, price, inventory, categoryId }
      ) => {
        await randomDelay(35, 50); // Product creation validation and processing
        const category = categories.find((c) => c.id === categoryId);
        if (!category)
          throw new Error(`Category with ID ${categoryId} not found`);

        const newProduct = {
          id: `product-${products.length + 1}`,
          name,
          description,
          price,
          inventory,
          categoryId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        products.push(newProduct);
        return newProduct;
      },

      updateProduct: async (
        _,
        { id, name, description, price, inventory, categoryId }
      ) => {
        await randomDelay(30, 45);
        const product = products.find((p) => p.id === id);
        if (!product) throw new Error(`Product with ID ${id} not found`);

        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (inventory !== undefined) product.inventory = inventory;
        if (categoryId !== undefined) {
          const category = categories.find((c) => c.id === categoryId);
          if (!category)
            throw new Error(`Category with ID ${categoryId} not found`);
          product.categoryId = categoryId;
        }

        product.updatedAt = new Date().toISOString();
        return product;
      },

      createCategory: async (_, { name }) => {
        await randomDelay(20, 30); // Categories are simple objects
        const newCategory = {
          id: `category-${categories.length + 1}`,
          name,
        };

        categories.push(newCategory);
        return newCategory;
      },

      createReview: async (_, { productId, userId, rating, comment }) => {
        await randomDelay(25, 40);
        const product = products.find((p) => p.id === productId);
        if (!product) throw new Error(`Product with ID ${productId} not found`);

        const user = users.find((u) => u.id === userId);
        if (!user) throw new Error(`User with ID ${userId} not found`);

        const newReview = {
          id: `review-${reviews.length + 1}`,
          rating,
          comment,
          userId,
          productId,
          createdAt: new Date().toISOString(),
        };

        reviews.push(newReview);
        return newReview;
      },

      createOrder: async (_, { userId, items }) => {
        await randomDelay(50, 70); // Orders are complex with many validations
        const user = users.find((u) => u.id === userId);
        if (!user) throw new Error(`User with ID ${userId} not found`);

        const orderItems = items.map((item, idx) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product)
            throw new Error(`Product with ID ${item.productId} not found`);

          return {
            id: `order-item-${orders.length + 1}-${idx}`,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          };
        });

        const total = orderItems.reduce((sum, item) => {
          const product = products.find((p) => p.id === item.productId);
          return sum + product.price * item.quantity;
        }, 0);

        const newOrder = {
          id: `order-${orders.length + 1}`,
          userId,
          items: orderItems,
          status: "PENDING",
          total,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        orders.push(newOrder);
        return newOrder;
      },

      updateOrderStatus: async (_, { id, status }) => {
        await randomDelay(20, 35);
        const order = orders.find((o) => o.id === id);
        if (!order) throw new Error(`Order with ID ${id} not found`);

        order.status = status;
        order.updatedAt = new Date().toISOString();

        return order;
      },
    },

    User: {
      orders: (user) => {
        return orders.filter((order) => order.userId === user.id);
      },
    },

    Product: {
      category: (product) => {
        return categories.find((c) => c.id === product.categoryId);
      },
      reviews: (product) => {
        return reviews.filter((review) => review.productId === product.id);
      },
    },

    Category: {
      products: (category) => {
        return products.filter((product) => product.categoryId === category.id);
      },
    },

    Review: {
      user: (review) => {
        return users.find((user) => user.id === review.userId);
      },
      product: (review) => {
        return products.find((product) => product.id === review.productId);
      },
    },

    Order: {
      user: (order) => {
        return users.find((user) => user.id === order.userId);
      },
      items: (order) => {
        return order.items.map((item) => ({
          ...item,
          product: products.find((p) => p.id === item.productId),
        }));
      },
    },

    OrderItem: {
      product: (orderItem) => {
        return products.find((product) => product.id === orderItem.productId);
      },
    },
  };