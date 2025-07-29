const CartDB = require("../model/cart");

// Hàm tạo key duy nhất cho item (productId + variant)
function buildKey(item) {
  const color = item.variant && item.variant.color ? item.variant.color : "";
  const size = item.variant && item.variant.size ? item.variant.size : "";
  return `${item.productId}__${color}__${size}`;
}

async function mergeCarts(guestId, userId) {
  if (!guestId || !userId || guestId === userId) return;

  // Lấy giỏ hàng của guest và user
  const [guestCart, userCart] = await Promise.all([
    CartDB.findOne({ userId: guestId }),
    CartDB.findOne({ userId }),
  ]);

  // Nếu không có giỏ guest -> bỏ qua
  if (!guestCart || !guestCart.items || guestCart.items.length === 0) return;

  // Nếu user chưa có giỏ, clone luôn giỏ guest
  if (!userCart) {
    await CartDB.create({
      userId,
      items: guestCart.items,
    });

    await CartDB.deleteOne({ userId: guestId });
    return;
  }

  // Merge giỏ hàng
  const map = new Map();

  // Đưa item user vào map
  for (const item of userCart.items) {
    const key = buildKey(item);
    map.set(key, { ...item._doc });
  }

  // Duyệt item guest và merge
  for (const gItem of guestCart.items) {
    const key = buildKey(gItem);
    if (map.has(key)) {
      const existed = map.get(key);
      existed.quantity += gItem.quantity;
      map.set(key, existed);
    } else {
      map.set(key, { ...gItem._doc });
    }
  }

  // Cập nhật giỏ hàng của user
  await CartDB.updateOne(
    { userId },
    { $set: { items: Array.from(map.values()) } }
  );

  // Xoá giỏ guest
  await CartDB.deleteOne({ userId: guestId });
}

module.exports = { mergeCarts };
