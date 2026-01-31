const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartbiz_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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

const generateOrders = (customers, count) => {
    const orders = [];
    const products = [
        { name: 'Premium Widget', price: 99.99 },
        { name: 'Super Gadget', price: 149.99 },
        { name: 'Ultra Tool', price: 79.99 },
        { name: 'Mega Device', price: 199.99 },
        { name: 'Pro Package', price: 299.99 },
    ];

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
                name: product.name,
                quantity: quantity,
                price: product.price
            });
        }

        // Create order with date in last 7 months
        const monthsAgo = Math.floor(Math.random() * 7);
        const orderDate = new Date();
        orderDate.setMonth(orderDate.getMonth() - monthsAgo);

        orders.push({
            customer: customer._id,
            items: items,
            totalAmount: Math.round(totalAmount * 100) / 100,
            status: Math.random() > 0.2 ? 'completed' : 'pending',
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

        // Generate and insert customers
        console.log('Generating 50 customers...');
        const customersData = generateCustomers(50);
        const customers = await Customer.insertMany(customersData);
        console.log(`✓ Created ${customers.length} customers`);

        // Generate and insert orders
        console.log('Generating 100 orders...');
        const ordersData = generateOrders(customers, 100);
        const orders = await Order.insertMany(ordersData);
        console.log(`✓ Created ${orders.length} orders`);

        // Generate and insert transactions
        console.log('Generating transactions...');
        const transactionsData = generateTransactions(orders);
        const transactions = await Transaction.insertMany(transactionsData);
        console.log(`✓ Created ${transactions.length} transactions`);

        console.log('\n✅ Database seeded successfully!');
        console.log(`
Summary:
- Customers: ${customers.length}
- Orders: ${orders.length}
- Transactions: ${transactions.length}
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
