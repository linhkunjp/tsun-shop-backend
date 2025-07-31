const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalAmount: String,
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const OrderDB = mongoose.model("OrderDB", OrderSchema);

module.exports = OrderDB;
