// ✅ Fonction pour générer un order_number unique
function generateOrderNumber(alias) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const timestamp = date.getTime().toString().slice(-5);
    const random = Math.floor(Math.random() * 99).toString().padStart(2, '0');

    return `${alias}-${year}-${timestamp}-${random}`;
}

module.exports = { generateOrderNumber };