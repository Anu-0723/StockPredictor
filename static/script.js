document.getElementById("predictForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const ticker = document.getElementById("symbol").value.trim();
    const resultDiv = document.getElementById("result");
    const loadingDiv = document.getElementById("loading");
    const errorDiv = document.getElementById("error");

    // Hide old data & show loader
    resultDiv.style.display = "none";
    errorDiv.style.display = "none";
    loadingDiv.style.display = "block";

    try {
        // ✅ Use your Render domain below:
        const response = await fetch(`https://stockpredictor-oa2t.onrender.com/?ticker=${encodeURIComponent(ticker)}`);

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Hide loader
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";

        // Fill in results
        document.getElementById("stockSymbol").textContent = data.symbol;
        document.getElementById("currentPrice").textContent = `$${data.current_price}`;
        document.getElementById("predictedPrice").textContent = `$${data.predicted_price}`;
        document.getElementById("sma10").textContent = data.sma10;
        document.getElementById("sma50").textContent = data.sma50;
        document.getElementById("rsi").textContent = data.rsi;
        document.getElementById("recommendation").textContent = data.recommendation;

    } catch (err) {
        console.error("Error:", err);
        loadingDiv.style.display = "none";
        errorDiv.style.display = "block";
        errorDiv.textContent = "⚠️ Network error: Unable to connect to the server or invalid symbol.";
    }
});
