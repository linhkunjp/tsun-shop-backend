const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: { type: String, required: true },
        title: String,
        quantity: { type: Number, required: true, default: 1 },
        variant: {
          color: String,
          size: String,
        },
        price: String,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

const CartDB = mongoose.model("CartDB", CartSchema);

module.exports = CartDB;
