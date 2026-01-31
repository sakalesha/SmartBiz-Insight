const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['sale', 'refund'],
        default: 'sale'
    },
    date: {
        type: Date,
        default: Date.now
    },
    month: {
        type: String,
        required: true
    }
});

// Auto-set month field before saving (format: YYYY-MM)
transactionSchema.pre('save', function (next) {
    if (!this.month && this.date) {
        const year = this.date.getFullYear();
        const month = String(this.date.getMonth() + 1).padStart(2, '0');
        this.month = `${year}-${month}`;
    }
    next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
