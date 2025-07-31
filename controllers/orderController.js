const OrderDB = require("../model/order");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const order = new OrderDB(req.body);

      await order.save();
      res.json({
        isSuccess: true,
        message: "Tạo đơn hàng thành công. Cảm ơn bạn đã mua hàng!",
      });
    } catch (err) {
      res
        .status(500)
        .json({ isSuccess: false, message: "Lỗi hệ thống, vui lòng thử lại" });
    }
  },
};

module.exports = orderController;
