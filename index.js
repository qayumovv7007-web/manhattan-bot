const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "8487452131:AAH7fcyKaMm9hArWWZkhpetbAVahnI7CGPQ"; // Tokenni almashtir!
const bot = new TelegramBot(token, { polling: true });

// API orqali mahsulotlarni olish funksiyasi
async function getProducts() {
  try {
    const res = await axios.get(
      "https://bot-node-kpcv.onrender.com/api/products"
    );
    return res.data;
  } catch (err) {
    console.error("API ERROR:", err.message);
    return [];
  }
}

// /start komandasi
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Assalomu alaykum! Menyudan tanlang 👇", {
    reply_markup: {
      keyboard: [
        ["🖼 Maxsulotlar", "📦 Buyurtma berish"],
        ["ℹ️ Biz haqimizda", "☎️ Bog‘lanish"],
      ],
      resize_keyboard: true,
    },
  });
});

// Tugmalarni tinglash
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // ⭐️ Rasmli katalog
  if (text === "🖼 Maxsulotlar") {
    const products = await getProducts();

    if (products.length === 0) {
      return bot.sendMessage(chatId, "❌ API dan mahsulot topilmadi.");
    }

    products.forEach((product) => {
      bot.sendPhoto(chatId, product.image, {
        caption: `💎 *${product.name}*\n💰 Narxi: *${product.price}*`,
        parse_mode: "Markdown",
      });
    });
  } else if (text === "📦 Buyurtma berish") {
    bot.sendMessage(chatId, "Buyurtma uchun ismingizni yuboring.");
  } else if (text === "ℹ️ Biz haqimizda") {
    bot.sendMessage(chatId, "Namangan Market — sifatli mahsulotlari 💐");
  } else if (text === "☎️ Bog‘lanish") {
    bot.sendMessage(chatId, "Aloqa: 999999999");
  }
});
