const mongoose = require("mongoose");

const TsunDBSchema = new mongoose.Schema(
  {
    slug: String,
    title: String,
    pro_sku: String,
    pro_sale: String,
    pro_price: String,
    regular_price: String,
    sort_price: Number,
    variants: [
      {
        title: String,
        type: { type: String },
        options: [
          {
            value: String,
            available: Boolean,
          },
        ],
      },
    ],
    isDisabled: Boolean,
    isContact: Boolean,
    images: [String],
    tabs: [
      {
        name: String,
        content: String,
        images: [String],
      },
    ],
    url: String,
    breadcrumbs: [String],
    categories: [String],
  },
  {
    collection: "TsunDB",
    timestamps: true,
  }
);

const TsunDB = mongoose.model("TsunDB", TsunDBSchema);

module.exports = TsunDB;
