const currencyDropdowns = document.querySelectorAll("form select"),
      sourceCurrency = document.querySelector(".from select"),
      targetCurrency = document.querySelector(".to select"),
      convertButton = document.querySelector("form button");

currencyDropdowns.forEach((dropdown, index) => {
    for (let currency in country_list) {
        let isSelected = index === 0 ? (currency === "USD" ? "selected" : "") : (currency === "SGD" ? "selected" : "");
        const optionMarkup = `<option value="${currency}" ${isSelected}>${currency}</option>`;
        dropdown.insertAdjacentHTML("beforeend", optionMarkup);
    }

    dropdown.addEventListener("change", event => {
        updateFlag(event.target);
    });
});

function updateFlag(selectedDropdown) {
    for (let currency in country_list) {
        if (currency === selectedDropdown.value) {
            const flagImage = selectedDropdown.parentElement.querySelector("img");
            flagImage.src = `https://flagcdn.com/48x36/${country_list[currency].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", () => {
    fetchExchangeRate();
});

convertButton.addEventListener("click", event => {
    event.preventDefault();
    fetchExchangeRate();
});

const swapIcon = document.querySelector("form .icon");
swapIcon.addEventListener("click", () => {
    let temporaryCurrency = sourceCurrency.value;
    sourceCurrency.value = targetCurrency.value;
    targetCurrency.value = temporaryCurrency;
    updateFlag(sourceCurrency);
    updateFlag(targetCurrency);
    fetchExchangeRate();
});

function fetchExchangeRate() {
    const inputAmount = document.querySelector("form input");
    const exchangeRateDisplay = document.querySelector("form .exchange-rate");
    let amountInputValue = inputAmount.value;

    if (!amountInputValue || amountInputValue === "0") {
        inputAmount.value = "1";
        amountInputValue = 1;
    }

    exchangeRateDisplay.innerText = "Getting exchange rate...";
    let apiUrl = `https://v6.exchangerate-api.com/v6/91efafef95bb499290374b3a/latest/${sourceCurrency.value}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(result => {
            let exchangeRate = result.conversion_rates[targetCurrency.value];
            let convertedAmount = (amountInputValue * exchangeRate).toFixed(2);
            exchangeRateDisplay.innerText = `${amountInputValue} ${sourceCurrency.value} = ${convertedAmount} ${targetCurrency.value}`;
        })
        .catch(() => {
            exchangeRateDisplay.innerText = "An error occurred while fetching data.";
        });
}