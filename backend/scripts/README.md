# SmartBiz Insight - Seed Data Script

This script populates your MongoDB database with sample data for testing and development purposes.

## What it creates:
- **50 Customers** with realistic names, emails, phone numbers, and addresses
- **100 Orders** distributed across the last 7 months
- **Transactions** automatically created for all completed orders

## Usage:

### 1. Make sure MongoDB is running locally or you have a valid MONGO_URI

### 2. Run the script from the project root:
```bash
node backend/scripts/seedData.js
```

### 3. The script will:
- Clear all existing customers, orders, and transactions
- Generate and insert new sample data
- Display a summary of created records

## Output Example:
```
Clearing existing data...
Generating 50 customers...
✓ Created 50 customers
Generating 100 orders...
✓ Created 100 orders
Generating transactions...
✓ Created 75 transactions

✅ Database seeded successfully!

Summary:
- Customers: 50
- Orders: 100
- Transactions: 75
```

## Note:
- This script will **DELETE ALL EXISTING DATA** before seeding
- Only run this on development/testing databases, never on production
- Transactions are only created for completed orders (approximately 75% of orders)
- Orders and transactions are distributed across the last 7 months for realistic analytics

## API Endpoints Available After Seeding:

### Dashboard:
- `GET /api/dashboard/stats` - Get total revenue, customers, orders, and growth rate
- `GET /api/dashboard/analytics` - Get revenue and user growth charts data

### Customers:
- `GET /api/customers` - List all customers (paginated)
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Orders:
- `GET /api/orders` - List all orders (paginated)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
