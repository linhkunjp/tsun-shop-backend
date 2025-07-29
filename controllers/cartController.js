const CartDB = require("../model/cart");

const cartController = {
  // Lấy giỏ hàng theo user
  getCartByUser: async (req, res) => {
    try {
      const results = await CartDB.findOne({ userId: req.params.userId });
      if (!results) {
        return res
          .status(404)
          .json({ isSuccess: false, error: "Cart not found" });
      }
      res.status(200).json({ isSuccess: true, results: results });
    } catch (err) {
      res.status(500).json({ isSuccess: false, message: err.message });
    }
  },

  // Thêm giỏ hàng, cập nhật sản phẩm đã có sẵn
  addToCart: async (req, res) => {
    const { userId, items } = req.body;

    try {
      let cart = await CartDB.findOne({ userId });

      if (!cart) {
        cart = new CartDB({ userId, items });
      } else {
        for (const newItem of items) {
          const existingItem = cart.items.find(
            (item) =>
              item.productId === newItem.productId &&
              item.variant?.color === newItem.variant?.color &&
              item.variant?.size === newItem.variant?.size
          );

          if (existingItem) {
            existingItem.quantity += newItem.quantity;
          } else {
            cart.items.push(newItem);
          }
        }
      }

      await cart.save();
      res.status(200).json({ isSuccess: true, results: cart });
    } catch (err) {
      res.status(500).json({ isSuccess: false, message: err.message });
    }
  },

  // Xoá giỏ hàng
  clearCart: async (req, res) => {
    try {
      await CartDB.findOneAndDelete({ userId: req.params.userId });
      res.status(200).json({ isSuccess: true, message: "Cart cleared" });
    } catch (err) {
      res.status(500).json({ isSuccess: false, message: err.message });
    }
  },

  //  Xóa theo id
  removeCartItem: async (req, res) => {
    const { userId, itemId } = req.params;

    try {
      const cart = await CartDB.findOne({ userId });

      if (!cart) {
        return res
          .status(404)
          .json({ isSuccess: false, message: "Cart not found" });
      }

      cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

      await cart.save();

      res.status(200).json({ isSuccess: true, results: cart });
    } catch (err) {
      res.status(500).json({ isSuccess: false, message: err.message });
    }
  },

  // Cập nhật toàn bộ giỏ hàng
  updateCart: async (req, res) => {
    const { userId, items } = req.body;

    if (!userId || !Array.isArray(items)) {
      return res
        .status(400)
        .json({ isSuccess: false, message: "Invalid request body" });
    }

    try {
      let cart = await CartDB.findOne({ userId });

      if (cart) {
        cart.items = items; // Ghi đè toàn bộ
      } else {
        cart = new CartDB({ userId, items });
      }

      await cart.save();

      res.status(200).json({ isSuccess: true, results: cart });
    } catch (err) {
      res.status(500).json({ isSuccess: false, message: err.message });
    }
  },
};

module.exports = cartController;
