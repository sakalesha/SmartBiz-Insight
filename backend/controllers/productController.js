const Product = require('../models/Product');

// Get all products with optional filtering and pagination
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { sku: { $regex: req.query.search, $options: 'i' } },
                { category: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filter);

        res.json({
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// Create new product
const createProduct = async (req, res) => {
    try {
        const { name, sku, category, price, stockQuantity, description, status, image } = req.body;

        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this SKU already exists' });
        }

        const product = new Product({
            name,
            sku,
            category,
            price,
            stockQuantity,
            description,
            status,
            image
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { name, sku, category, price, stockQuantity, description, status, image } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (sku && sku !== product.sku) {
            const existingProduct = await Product.findOne({ sku });
            if (existingProduct) {
                return res.status(400).json({ message: 'Product with this SKU already exists' });
            }
        }

        product.name = name || product.name;
        product.sku = sku || product.sku;
        product.category = category || product.category;
        product.price = price !== undefined ? price : product.price;
        product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
        product.description = description || product.description;
        product.status = status || product.status;
        product.image = image || product.image;

        await product.save();
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
