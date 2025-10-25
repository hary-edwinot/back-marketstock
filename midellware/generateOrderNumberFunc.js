// ✅ Fonction pour générer un order_number unique
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const timestamp = date.getTime().toString().slice(-5);
    const random = Math.floor(Math.random() * 99).toString().padStart(2, '0');

    return `CMD-${year}-${timestamp}-${random}`;
}

module.exports = { generateOrderNumber };