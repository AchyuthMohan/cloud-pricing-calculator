# Cost Analyzer for Azure Cloud

A Node.js API to calculate Azure cloud costs using the Azure Retail Prices API.

## Features

- Calculate costs for Azure services based on SKU, region, and usage
- Supports consumption and reservation pricing
- Handles pagination for large result sets
- CORS enabled for frontend integration

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cost-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set the Azure Retail Prices API URL:
   ```
   PRICE_URL=https://prices.azure.com/api/retail/prices?$filter=
   ```

## Usage

Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### POST /calculate-cost

Calculates the estimated cost for an Azure service.

**Request Body:**
```json
{
  "serviceName": "Virtual Machines",
  "armSkuName": "Standard_D2_v3",
  "armRegionName": "eastus",
  "priceType": "Consumption",
  "usageQuantity": 730,
  "unitOfMeasure": "1 Hour"
}
```

**Response:**
```json
{
  "service": "Virtual Machines",
  "sku": "Standard_D2_v3",
  "region": "eastus",
  "priceType": "Consumption",
  "unitPrice": 0.096,
  "unitOfMeasure": "1 Hour",
  "usageQuantity": 730,
  "estimatedCost": 70.08,
  "currency": "USD"
}
```

**Parameters:**
- `serviceName`: The Azure service name (e.g., "Virtual Machines")
- `armSkuName`: The ARM SKU name (e.g., "Standard_D2_v3")
- `armRegionName`: The ARM region name (e.g., "eastus")
- `priceType`: "Consumption" or "Reservation"
- `usageQuantity`: The quantity of usage (e.g., hours)
- `unitOfMeasure`: The unit of measure (e.g., "1 Hour")

**Error Responses:**
- 400: Missing required parameters
- 404: No matching price found
- 500: Failed to fetch prices from Azure

## CORS Configuration

The API is configured to allow requests from `http://localhost:5500`. Update the CORS origin in `server.js` if needed for other domains.

## Dependencies

- express: Web framework
- axios: HTTP client for API requests
- dotenv: Environment variable management
- cors: Cross-origin resource sharing

## License

ISC

## Author

Achyuth Mohan</content>
<parameter name="filePath">/Users/achyuthmohan/Desktop/projects/cost-analyzer/README.md