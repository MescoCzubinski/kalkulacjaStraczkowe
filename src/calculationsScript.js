class CalculatorBlock {
  constructor(containerId, inputs, resultText, resultUnit, checkMode, calculation) {
    this.container = document.querySelector(containerId);
    this.containerId = containerId.toLowerCase();
    this.inputs = inputs;
    this.resultText = resultText;
    this.resultUnit = resultUnit;
    this.checkMode = checkMode;
    this.calculation = calculation;
    this.inputElements = [];

    this.render();
  }

  render() {
    let section = document.createElement("div");
    section.classList.add("w-80", "p-3", "flex", "flex-col", "justify-start");

    let inputsContainer = document.createElement("div");

    this.inputs.forEach((inputData) => {
      let inputWrapper = document.createElement("div");
      inputWrapper.classList.add("mb-5");

      let inputContainer = document.createElement("div");
      inputContainer.classList.add("flex");

      let inputName = document.createElement("div");
      inputName.classList.add("text-xl", "pb-2", "pl-2");
      inputName.textContent = inputData.name;

      if (this.checkMode === "all-check") {
        let checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.classList.add("mr-4");
        checkboxInput.id = `${inputData.id.toLowerCase().replace("#", "").replace(/\s+/g, "-")}-checkbox`;

        inputContainer.appendChild(checkboxInput);
      }

      let inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.inputMode = "numeric";
      inputElement.pattern = "[0-9]*";
      inputElement.placeholder = inputData.placeholder;
      inputElement.id = inputData.id.toLowerCase();
      inputElement.classList.add("w-24", "h-12", "pl-2", "text-xl", "border-2", "border-bg-info", "rounded-3xl", "flex-1", "hover:bg-bg-info/25");

      let unitElement = document.createElement("div");
      unitElement.classList.add("ml-2", "text-xl", "flex", "items-center");
      unitElement.textContent = inputData.unit;

      inputContainer.appendChild(inputElement);
      inputContainer.appendChild(unitElement);

      inputWrapper.appendChild(inputName);
      inputWrapper.appendChild(inputContainer);
      inputsContainer.appendChild(inputWrapper);

      this.inputElements.push(inputElement);
    });

    section.appendChild(inputsContainer);

    let resultContainer = document.createElement("div");
    resultContainer.classList.add("flex", "pl-2", "pr-2", "justify-between");

    let resultText = document.createElement("div");
    resultText.classList.add("text-xl", "text-center");
    resultText.textContent = this.resultText;

    let resultValue = document.createElement("div");
    resultValue.classList.add("text-xl", "text-top-agrar-green", "text-center");
    resultValue.innerHTML = "podaj wartości";
    resultValue.id = `${this.containerId.replace("#", "").replace(/\s+/g, "-")}-result`;

    resultContainer.appendChild(resultText);
    resultContainer.appendChild(resultValue);
    section.appendChild(resultContainer);

    if (this.checkMode === "one-check") {
      let checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("flex", "flex-wrap", "h-fit", "items-center", "justify-between", "ml-2", "mt-4");

      let checkboxText = document.createElement("div");
      checkboxText.classList.add("text-xl", "text-left");
      checkboxText.textContent = "Zatwierdź w kalkulacji:";

      let checkboxInput = document.createElement("input");
      checkboxInput.type = "checkbox";
      checkboxInput.id = `${this.containerId.replace("#", "").replace(/\s+/g, "-")}-checkbox`;

      checkboxContainer.appendChild(checkboxText);
      checkboxContainer.appendChild(checkboxInput);
      section.appendChild(checkboxContainer);
    }

    let containerHeader = document.createElement("div");
    containerHeader.classList.add("flex", "w-full", "pl-10", "pr-10", "justify-between", "p-3");

    let headerName = document.createElement("div");
    headerName.classList.add("text-2xl", "font-bold");
    headerName.textContent = this.containerId.replace("#", "").toUpperCase();

    let headerButton = document.createElement("button");
    headerButton.classList.add("show-hide-button", "border-bg-info", "border-2", "rounded-2xl", "p-1", "text-lg");
    headerButton.textContent = "Rozwiń";
    containerHeader.appendChild(headerName);
    containerHeader.appendChild(headerButton);

    let containerContent = document.createElement("div");
    containerContent.classList.add("show-hide-content", "flex", "flex-wrap", "w-full", "justify-center");
    containerContent.appendChild(section);

    this.container.appendChild(containerHeader);
    this.container.appendChild(containerContent);

    this.inputElements.forEach((input) => {
      input.addEventListener("input", () => {
        this.calculateResult();
      });

      let inputCheckboxElement = document.querySelector("#" + input.id + "-checkbox");
      if (inputCheckboxElement) {
        inputCheckboxElement.addEventListener("change", () => {
          this.calculateResult();
        });
      }
    });

    this.calculateResult = () => {
      let values = this.inputElements.map((input) => {
        let inputCheckboxElement = document.querySelector("#" + input.id + "-checkbox");

        if (inputCheckboxElement && inputCheckboxElement.checked) {
          return Number(input.value) || 0;
        } else if (!inputCheckboxElement) {
          return Number(input.value) || 0;
        }
        return 0;
      });

      let result = this.calculation(...values);
      if (result !== 0 && result !== Infinity && !isNaN(result)) {
        resultValue.innerHTML = result.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ` ${this.resultUnit}`;
      } else {
        resultValue.innerHTML = "podaj wartości";
      }
    };
  }
}

new CalculatorBlock(
  "#transport",
  [
    { id: "liczba-km", name: "Podaj liczbę km", placeholder: "Podaj liczbę km", unit: "km" },
    { id: "koszt-km", name: "Podaj koszt za ha", placeholder: "Podaj koszt za km", unit: "zł/km" },
  ],
  "wynik:",
  "zł",
  "one-check",
  (a, b) => a * b
);
new CalculatorBlock(
  "#zbior",
  [
    { id: "liczba-33333km", name: "Podaj liczbę km", placeholder: "Podaj liczbę km", unit: "km" },
    { id: "koszt-3333km", name: "Podaj koszt za ha", placeholder: "Podaj koszt za km", unit: "zł/km" },
  ],
  "wynik:",
  "zł",
  "all-check",
  (a, b) => a * b
);
