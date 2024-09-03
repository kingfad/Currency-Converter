const { hexToString, stringToHex } = require("viem");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

const exchangeRates = {
  USD: { EUR: 0.85, GBP: 0.75, JPY: 110.0 },
  EUR: { USD: 1.18, GBP: 0.88, JPY: 129.5 },
  GBP: { USD: 1.33, EUR: 1.14, JPY: 147.0 },
  JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0068 }
};

function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  if (!exchangeRates[fromCurrency] || !exchangeRates[fromCurrency][toCurrency]) {
    throw new Error("Unsupported currency conversion");
  }

  const rate = exchangeRates[fromCurrency][toCurrency];
  return (amount * rate).toFixed(2);
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payloadString = hexToString(data.payload);
  console.log(`Converted payload: ${payloadString}`);

  try {
    const payload = JSON.parse(payloadString);
    console.log(payload.amount, payload.fromCurrency, payload.toCurrency);

    const result = convertCurrency(payload.amount, payload.fromCurrency, payload.toCurrency);
    const outputStr = stringToHex(JSON.stringify({ convertedAmount: result }));

    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: outputStr }),
    });
  } catch (error) {
    console.error("Error processing request:", error);
  }
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();