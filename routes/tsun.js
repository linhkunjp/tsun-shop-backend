const router = require("express").Router();
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

// Get product list
router.get("/collections", productController.getAllProduct);

// Get product detail
router.get("/products/:slug", productController.getProductDetail);

// Search product
router.get("/search", productController.searchProduct);

// Get cart list
router.get("/cart/:userId", cartController.getCartByUser);

// Add to cart
router.post("/cart", cartController.addToCart);

// Clear cart
router.delete("/cart/:userId", cartController.clearCart);

// Remove cart item
router.delete("/cart/:userId/:itemId", cartController.removeCartItem);

// Update cart
router.put("/cart/update", cartController.updateCart);

// Register
router.post("/auth/register", authController.registerUser);

// Login
router.post("/auth/login", authController.loginUser);

module.exports = router;
