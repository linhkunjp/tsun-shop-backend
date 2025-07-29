const TsunDB = require("../model/product");

const productController = {
  // Get all product
  getAllProduct: async (req, res) => {
    const category = req.query.category;
    const sortQuery = req.query.sort;
    const search = req.query.q;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit; // Bỏ qua các sản phẩm trang trước

    try {
      let query = {};

      // Nếu có category
      if (category) {
        query.categories = category;
      }

      // Nếu có từ khóa tìm kiếm
      if (search) {
        query.title = { $regex: search, $options: "i" }; // tìm không phân biệt hoa thường
      }

      // Xử lý sắp xếp
      let sortOptions = {};
      switch (sortQuery) {
        case "name_asc":
          sortOptions = { title: 1 }; // Tên từ A → Z
          break;
        case "name_desc":
          sortOptions = { title: -1 }; // Tên từ Z → A
          break;
        case "price_asc":
          sortOptions = { sort_price: 1 }; // Giá tăng dần
          break;
        case "price_desc":
          sortOptions = { sort_price: -1 }; // Giá giảm dần
          break;
        case "created_asc":
          sortOptions = { createdAt: -1 }; // Mới nhất
          break;
        case "created_desc":
          sortOptions = { updatedAt: -1 }; // Cũ nhất
          break;
        default:
          sortOptions = { createdAt: -1 };
          break;
      }

      const total = await TsunDB.countDocuments(query); // Tổng số sản phẩm
      const results = await TsunDB.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit); // Danh sách sản phẩm

      if (!results) {
        return res
          .status(404)
          .json({ isSuccess: false, error: "Product not found" });
      }

      const pageInfo = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      res.status(200).json({
        isSuccess: true,
        data: {
          pageInfo,
          results,
        },
      });
    } catch {
      res.status(500).json({ isSuccess: false, error: err.message });
    }
  },

  // Get detail product
  getProductDetail: async (req, res) => {
    try {
      const results = await TsunDB.findOne({ slug: req.params.slug });

      if (!results) {
        return res
          .status(404)
          .json({ isSuccess: false, error: "Product not found" });
      }

      res.status(200).json({
        isSuccess: true,
        data: {
          results,
        },
      });
    } catch {
      res.status(500).json({ isSuccess: false, error: err.message });
    }
  },

  // Search product
  searchProduct: async (req, res) => {
    const search = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; // Bỏ qua các sản phẩm trang trước

    try {
      let query = {};

      if (search) {
        query.title = { $regex: search, $options: "i" }; // tìm không phân biệt hoa thường
      }

      const total = await TsunDB.countDocuments(query); // Tổng số sản phẩm
      const results = await TsunDB.find(query).skip(skip).limit(limit); // Danh sách sản phẩm

      const pageInfo = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      if (!results) {
        return res
          .status(404)
          .json({ isSuccess: false, error: "Product not found" });
      }

      res.status(200).json({
        isSuccess: true,
        data: {
          pageInfo,
          results,
        },
      });
    } catch (err) {
      res.status(500).json({ isSuccess: false, error: err.message });
    }
  },
};

module.exports = productController;
