# Currency Converter DApp

This decentralized application (DApp) implements a simple currency conversion system using Cartesi Rollups technology. Users can convert amounts between USD, EUR, GBP, and JPY using predefined exchange rates.

## Installation

1. Clone this repository:

2. Install dependencies:
   ```
   npm install
   ```

## Running the DApp

Start the DApp using the Cartesi Rollups environment. Refer to the Cartesi documentation for detailed instructions on how to run a Rollups DApp.

## Interacting with the DApp

### Sending Inputs (Advance Requests)

To convert currency, send a JSON payload with the following structure:

```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "EUR"
}
```

The DApp will respond with a notice containing the converted amount.

### Making Inspect Calls

This DApp does not implement any inspect state functionality.

## Notes

- The DApp supports conversions between USD, EUR, GBP, and JPY.
- Exchange rates are predefined and stored within the DApp.
- All inputs and outputs are processed as hexadecimal strings and converted to/from UTF-8.
- The DApp uses the `viem` library for hex-string conversions.
- Error handling is implemented for unsupported currency conversions.
- Converted amounts are rounded to two decimal places.
- The current implementation does not update exchange rates dynamically.
