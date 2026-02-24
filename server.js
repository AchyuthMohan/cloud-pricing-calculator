// app.js - Node.js API to calculate Azure cloud costs using Retail Prices API

const express = require('express');
const axios = require('axios');
const { priceUrl } = require('./config');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5500'
}));

// Endpoint: POST /calculate-cost
// Example body: 
// {
//   "serviceName": "Virtual Machines",
//   "armSkuName": "Standard_D2_v3",
//   "armRegionName": "eastus",
//   "priceType": "Consumption", // or "Reservation"
//   "usageQuantity": 730, // e.g., hours in a month
//   "unitOfMeasure": "1 Hour" // must match the API's unitOfMeasure
// }
// Note: This is a basic example focused on VMs. Adapt for other services as needed.
// For reservations, add "reservationTerm": "1 Year" in filter if applicable.

app.post('/calculate-cost', async (req, res) => {
  const { serviceName, armSkuName, armRegionName, priceType, usageQuantity, unitOfMeasure } = req.body;

  if (!serviceName || !armSkuName || !armRegionName || !priceType || !usageQuantity || !unitOfMeasure) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Construct OData filter
  let filter = `serviceName eq '${serviceName}' and armSkuName eq '${armSkuName}' and armRegionName eq '${armRegionName}' and priceType eq '${priceType}'`;

  try {
    let items = [];
    let nextPageLink = `${priceUrl}${encodeURIComponent(filter)}`;
    // Handle pagination
    while (nextPageLink) {
      const response = await axios.get(nextPageLink);
      const data = response.data;
      items = items.concat(data.Items);
      nextPageLink = data.NextPageLink;
    }

    // Find the matching item with the correct unitOfMeasure
    const matchingItem = items.find(item => item.unitOfMeasure === unitOfMeasure);

    if (!matchingItem) {
      return res.status(404).json({ error: 'No matching price found' });
    }

    // Calculate cost: retailPrice * usageQuantity
    // Note: For more accuracy, consider effectivePrice if applicable, or handle reservations/savings plans differently.
    const cost = matchingItem.retailPrice * usageQuantity;

    res.json({
      service: serviceName,
      sku: armSkuName,
      region: armRegionName,
      priceType,
      unitPrice: matchingItem.retailPrice,
      unitOfMeasure: matchingItem.unitOfMeasure,
      usageQuantity,
      estimatedCost: cost,
      currency: matchingItem.currencyCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch prices from Azure' });
  }
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});