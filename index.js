const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "8487452131:AAH7fcyKaMm9hArWWZkhpetbAVahnI7CGPQ";
const bot = new TelegramBot(token, { polling: true });

// -------------------------
// API FUNKSIYALARI
// -------------------------

// Mahsulotlarni olish
async function getProducts() {
  try {
    const res = await axios.get(
      "https://bot-node-kpcv.onrender.com/api/products"
    );
    return res.data;
  } catch (err) {
    console.error("API PRODUCT ERROR:", err.message);
    return [];
  }
}

// Categoriyalarni olish
async function getCategories() {
  try {
    const res = await axios.get(
      "https://bot-node-kpcv.onrender.com/api/categories"
    );
    return res.data;
  } catch (err) {
    console.error("API CATEGORY ERROR:", err.message);
    return [];
  }
}

// -------------------------
// /start KOMANDASI
// -------------------------
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Assalomu alaykum! Menyudan tanlang 👇", {
    reply_markup: {
      keyboard: [
        ["🖼 Maxsulotlar", "Katalog", "📦 Buyurtma berish"],
        ["ℹ️ Biz haqimizda", "☎️ Bog‘lanish"],
      ],
      resize_keyboard: true,
    },
  });
});

// -------------------------
// TUGMALAR TINGLASH
// -------------------------
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // -------------------------
  // MAXSULOTLAR
  // -------------------------
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

    // -------------------------
    // KATALOG (kategoriya ro'yxati)
    // -------------------------
  } else if (text === "Katalog") {
    const categories = await getCategories();

    if (categories.length === 0) {
      return bot.sendMessage(chatId, "❌ API dan categoriyalar topilmadi.");
    }

    let list = "📂 *Categoriyalar ro'yxati:*\n\n";

    categories.forEach((cat) => {
      list += `🔸 *${cat.name}*\n`;
    });

    bot.sendMessage(chatId, list, { parse_mode: "Markdown" });

    // -------------------------
    // BUYURTMA
    // -------------------------
  } else if (text === "📦 Buyurtma berish") {
    bot.sendMessage(chatId, "Buyurtma uchun ismingizni yuboring.");

    // -------------------------
    // BIZ HAQIMIZDA
    // -------------------------
  } else if (text === "ℹ️ Biz haqimizda") {
    bot.sendMessage(chatId, "Namangan Market — sifatli mahsulotlar markazi 💐");

    // -------------------------
    // BOG‘LANISH
    // -------------------------
  } else if (text === "☎️ Bog‘lanish") {
    bot.sendMessage(chatId, "Aloqa: +998 99 999 99 99");
  }
});
