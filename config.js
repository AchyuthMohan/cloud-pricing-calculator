const dotenv = require('dotenv');

dotenv.config();

const priceUrl = process.env.PRICE_URL
module.exports = { priceUrl };