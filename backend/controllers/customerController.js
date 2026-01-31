const Customer = require('../models/Customer');

// Get all customers
const getCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const customers = await Customer.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Customer.countDocuments();

        res.json({
            customers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Failed to fetch customers' });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ message: 'Failed to fetch customer' });
    }
};

// Create new customer
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, status } = req.body;

        // Check if email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer with this email already exists' });
        }

        const customer = new Customer({
            name,
            email,
            phone,
            address,
            status: status || 'active'
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Failed to create customer' });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, status } = req.body;

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, status },
            { new: true, runValidators: true }
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Failed to update customer' });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Failed to delete customer' });
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
