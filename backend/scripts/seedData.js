const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartbiz_db');
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const generateCustomers = (count) => {
    const customers = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'James', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

        customers.push({
            name: `${firstName} ${lastName}`,
            email: email,
            phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            address: {
                street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
                city: cities[Math.floor(Math.random() * cities.length)],
                state: states[Math.floor(Math.random() * states.length)],
                zip: String(Math.floor(Math.random() * 90000) + 10000)
            },
            status: Math.random() > 0.1 ? 'active' : 'inactive'
        });
    }
    return customers;
};

const generateProducts = () => {
    return [
        { name: 'Premium Widget', sku: 'WGT-001', category: 'Widgets', price: 99.99, stockQuantity: 100, description: 'High quality widget', status: 'active' },
        { name: 'Super Gadget', sku: 'GDG-001', category: 'Gadgets', price: 149.99, stockQuantity: 50, description: 'Cutting edge gadget', status: 'active' },
        { name: 'Ultra Tool', sku: 'TOL-001', category: 'Tools', price: 79.99, stockQuantity: 75, description: 'Durable tool', status: 'active' },
        { name: 'Mega Device', sku: 'DEV-001', category: 'Electronics', price: 199.99, stockQuantity: 30, description: 'Powerful device', status: 'active' },
        { name: 'Pro Package', sku: 'PKG-001', category: 'Bundles', price: 299.99, stockQuantity: 20, description: 'All-in-one package', status: 'active' },
        { name: 'Basic Kit', sku: 'KIT-001', category: 'Kits', price: 49.99, stockQuantity: 150, description: 'Starter kit', status: 'active' },
        { name: 'Deluxe Set', sku: 'SET-001', category: 'Sets', price: 179.99, stockQuantity: 40, description: 'Luxury set', status: 'active' },
        { name: 'Standard Bundle', sku: 'BND-001', category: 'Bundles', price: 129.99, stockQuantity: 60, description: 'Standard bundle', status: 'active' },
        { name: 'Smart Watch', sku: 'WTC-001', category: 'Electronics', price: 249.99, stockQuantity: 45, description: 'Wearable tech', status: 'active' },
        { name: 'Wireless Earbuds', sku: 'AUD-001', category: 'Audio', price: 89.99, stockQuantity: 80, description: 'Crystal clear sound', status: 'active' }
    ];
};

const generateOrders = (customers, products, count) => {
    const orders = [];

    for (let i = 0; i < count; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let totalAmount = 0;

        for (let j = 0; j < itemCount; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const itemTotal = product.price * quantity;
            totalAmount += itemTotal;

            items.push({
                product: product._id,
                name: product.name,
                quantity: quantity,
                price: product.price
            });
        }

        // Create order with date in last 7 months
        const monthsAgo = Math.floor(Math.random() * 7);
        const daysAgo = Math.floor(Math.random() * 30);
        const orderDate = new Date();
        orderDate.setMonth(orderDate.getMonth() - monthsAgo);
        orderDate.setDate(orderDate.getDate() - daysAgo);

        const statuses = ['completed', 'completed', 'completed', 'pending', 'cancelled'];

        orders.push({
            orderNumber: `ORD-${String(i + 1).padStart(6, '0')}`,
            customer: customer._id,
            items: items,
            totalAmount: Math.round(totalAmount * 100) / 100,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            createdAt: orderDate
        });
    }
    return orders;
};

const generateTransactions = (orders) => {
    const transactions = [];

    orders.forEach(order => {
        if (order.status === 'completed') {
            const transactionDate = order.createdAt || new Date();
            const year = transactionDate.getFullYear();
            const month = String(transactionDate.getMonth() + 1).padStart(2, '0');

            transactions.push({
                order: order._id,
                amount: order.totalAmount,
                type: 'sale',
                date: transactionDate,
                month: `${year}-${month}`
            });
        }
    });

    return transactions;
};

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await Customer.deleteMany({});
        await Order.deleteMany({});
        await Transaction.deleteMany({});
        await Product.deleteMany({});
        // Also clear Users to reset roles (CAUTION: Resets all users)
        await User.deleteMany({});
        console.log('✓ Cleared existing data');

        // Generate Users
        console.log('\nGenerating Users...');
        const users = await User.insertMany([
            { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
            { name: 'Manager User', email: 'manager@example.com', password: 'password123', role: 'manager' },
            { name: 'Regular User', email: 'user@example.com', password: 'password123', role: 'user' }
        ]);
        console.log(`✓ Created ${users.length} users (Admin, Manager, User)`);

        // Generate and insert customers
        console.log('\nGenerating 50 customers...');
        const customersData = generateCustomers(50);
        const customers = await Customer.insertMany(customersData);
        console.log(`✓ Created ${customers.length} customers`);

        // Generate and insert products
        console.log('\nGenerating products...');
        const productsData = generateProducts();
        const products = await Product.insertMany(productsData);
        console.log(`✓ Created ${products.length} products`);

        // Generate and insert orders
        console.log('\nGenerating 100 orders...');
        const ordersData = generateOrders(customers, products, 100);
        const orders = await Order.insertMany(ordersData);
        console.log(`✓ Created ${orders.length} orders`);

        // Generate and insert transactions
        console.log('\nGenerating transactions...');
        const transactionsData = generateTransactions(orders);
        if (transactionsData.length > 0) {
            const transactions = await Transaction.insertMany(transactionsData);
            console.log(`✓ Created ${transactions.length} transactions`);
        } else {
            console.log('⚠ No completed orders, skipping transactions');
        }

        console.log('\n✅ Database seeded successfully!');
        console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SEED SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 Customers:     ${customers.length}
📦 Products:      ${products.length}
📦 Orders:        ${orders.length}
💰 Transactions:  ${transactionsData.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your database is now populated with test data!
You can now:
  • View analytics at /analytics
  • Manage customers at /customers  
  • Manage orders at /orders
  • See dashboard stats at /dashboard
        `);

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:');
        console.error(error.message);
        if (error.errors) {
            console.error('\nValidation errors:');
            Object.keys(error.errors).forEach(key => {
                console.error(`  - ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedDatabase();
