class CalculatorBlock {
  constructor(containerId, containerName, inputs, resultText, resultUnit, backgroundInfo, checkMode, calculation) {
    this.container = document.querySelector(containerId);
    this.containerId = containerId.toLowerCase();
    this.containerName = containerName;
    this.inputs = inputs;
    this.resultText = resultText;
    this.resultUnit = resultUnit;
    this.backgroundInfo = backgroundInfo;
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
        checkboxInput.id = `${inputData.id.toLowerCase().replaceAll("#", "").replaceAll(/\s+/g, "-")}-checkbox`;

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

    if (this.backgroundInfo !== "") {
      let backgroundInfoContainer = document.createElement("div");
      backgroundInfoContainer.classList.add("text-xl", "text-bg-info", "ml-2", "mb-5");
      backgroundInfoContainer.textContent = this.backgroundInfo;
      inputsContainer.appendChild(backgroundInfoContainer);
    }

    section.appendChild(inputsContainer);

    let resultContainer = document.createElement("div");
    resultContainer.classList.add("flex", "pl-2", "pr-2", "justify-between");

    let resultText = document.createElement("div");
    resultText.classList.add("text-xl", "text-center");
    resultText.textContent = this.resultText;

    let resultValue = document.createElement("div");
    resultValue.classList.add("text-xl", "text-top-agrar-green", "text-center");
    resultValue.innerHTML = "podaj wartości";
    resultValue.id = `${this.containerId.replaceAll("#", "").replaceAll(/\s+/g, "-")}-result`;

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
      checkboxInput.id = `${this.containerId.replaceAll("#", "").replaceAll(/\s+/g, "-")}-checkbox`;

      checkboxContainer.appendChild(checkboxText);
      checkboxContainer.appendChild(checkboxInput);
      section.appendChild(checkboxContainer);
    }

    let containerHeader = document.createElement("div");
    containerHeader.classList.add("flex", "w-full", "sm:pl-14", "sm:pr-14", "justify-between", "p-3");

    let headerName = document.createElement("div");
    headerName.classList.add("text-2xl", "font-bold", "pt-1");
    headerName.textContent = this.containerName.toUpperCase();

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
      recalculateSectionHeight();
    };
  }
}
const exclusionMap = {
  "miedzyplony-checkbox": ["systemy-checkbox", "sloma-gleba-checkbox"],
  "nawozenie-podst-checkbox": ["integrowana-checkbox"],
  "nawozenie-wapnow-checkbox": ["integrowana-checkbox"],
  "struktura-checkbox": [""],
  "systemy-checkbox": ["miedzyplony-checkbox", "sloma-gleba-checkbox"],
  "sloma-gleba-checkbox": ["miedzyplony-checkbox", "systemy-checkbox"],
  "integrowana-checkbox": ["nawozenie-podst-checkbox", "nawozenie-wapnow-checkbox", "biologiczna-checkbox", "kwalifik-checkbox"],
  "biologiczna-checkbox": ["integrowana-checkbox"],
  "nawozenie-checkbox": [""],
  "kwalifik-checkbox": ["integrowana-checkbox"],
};

document.addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;

  let ekoschematy = document.querySelectorAll("#miedzyplony-checkbox, #nawozenie-podst-checkbox, #nawozenie-wapnow-checkbox, #struktura-checkbox, #systemy-checkbox, #sloma-gleba-checkbox, #integrowana-checkbox, #biologiczna-checkbox, #nawozenie-checkbox, #kwalifik-checkbox");

  ekoschematy.forEach((checkbox) => (checkbox.disabled = false));

  ekoschematy.forEach((checkbox) => {
    let excludedIds = exclusionMap[checkbox.id] || [];
    excludedIds.forEach((excludedId) => {
      if (!excludedId) return;
      let excludedCheckbox = document.querySelector(`#${excludedId}`);
      if (checkbox.checked && excludedCheckbox) {
        excludedCheckbox.disabled = true;
      }
    });
  });
});

function mainContentLoad() {
  new CalculatorBlock(
    "#przychody-z-plonu",
    "przychody z plonu",
    [
      { id: "zakladany-plon", name: "Zakładany plon:", placeholder: "", unit: "t/ha" },
      { id: "cena-skupu", name: "Cena skupu:", placeholder: "", unit: "zł/t" },
    ],
    "Wartość plonu:",
    "zł/ha",
    "",
    "no-check",
    (a, b) => a * b
  );
  new CalculatorBlock(
    "#doplaty",
    "dopłaty",
    [
      { id: "podst-wsp-doch", name: "Podstawowe wsparcie dochodów:", placeholder: "483.2", unit: "zł/ha" },
      { id: "redystr", name: "Płatność redystrybucyjna:", placeholder: "168.79", unit: "zł/ha" },
      { id: "stracz", name: "Płatność do strącz. na nasiona:", placeholder: "794.08", unit: "zł/ha" },
    ],
    "Razem dopłaty:",
    "zł/ha",
    "kliknij + aby uwzględnić w kalkulacji",
    "all-check",
    (a, b, c) => a + b + c
  );
  new CalculatorBlock(
    "#ekoschematy",
    "ekoschematy",
    [
      { id: "miedzyplony", name: "Międzyplony lub wsiewki:", placeholder: "435.10", unit: "zł/ha" },
      { id: "nawozenie-podst", name: "Plan nawożenia podst.:", placeholder: "87.02", unit: "zł/ha" },
      { id: "nawozenie-wapnow", name: "Plan nawożenia z wapnow.:", placeholder: "261.06", unit: "zł/ha" },
      { id: "struktura", name: "Zróżnicowana struktura upraw:", placeholder: "225.01", unit: "zł/ha" },
      { id: "systemy", name: "Zróżnicowana struktura upraw:", placeholder: "251.94", unit: "zł/ha" },
      { id: "sloma-gleba", name: "Wymieszanie słomy z glebą:", placeholder: "134.60", unit: "zł/ha" },
      { id: "integrowana", name: "Integrowana Produkcja Roślin:", placeholder: "818.92", unit: "zł/ha" },
      { id: "biologiczna", name: "Upr. biologiczna - ochrona:", placeholder: "300.06", unit: "zł/ha" },
      { id: "nawozenie", name: "Upr. biologiczna - nawożenie:", placeholder: "75.01", unit: "zł/ha" },
      { id: "kwalifik", name: "Kwalifik. mat. siewny:", placeholder: "", unit: "zł/ha" },
    ],
    "Razem ekoschematy:",
    "zł/ha",
    "*domyślne wartości za rok 2024, wykasuj i wpisz aktualne",
    "all-check",
    (a, b, c, d, e, f, g, h, i, j) => a + b + c + d + e + f + g + h + i + j
  );
  new CalculatorBlock(
    "#badanie-gleby",
    "badanie gleby",
    [
      { id: "cena-badania", name: "Cena badania:", placeholder: "koszt 1 próbki", unit: "zł/próbkę" },
      { id: "pow-badania", name: "Powierzch. badania:", placeholder: "pow. dla 1 próbki", unit: "ha" },
      { id: "czestosc", name: "Częstość:", placeholder: "co ile lat badanie", unit: "lat" },
    ],
    "Koszt badania:",
    "zł/ha/rok",
    "",
    "no-check",
    (a, b, c) => a / b / c
  );
  new CalculatorBlock(
    "#wapno",
    "wapno",
    [
      { id: "cena-wapna", name: "Cena wapna:", placeholder: "koszt 1 t wapna", unit: "zł/ha" },
      { id: "dawka-ha-wapna", name: "Dawka na ha:", placeholder: "dawka na 1 ha", unit: "zł/ha" },
      { id: "koszt-rozsiewu", name: "Koszt rozsiewu:", placeholder: "koszt rozsiewu na 1 ha", unit: "zł/ha" },
      { id: "koszt-zaladunku-wapno", name: "Koszt załadunku:", placeholder: "koszt załadunku 1 t", unit: "zł/t" },
      { id: "czestotliwosc-wapna", name: "Częstotliwość:", placeholder: "co ile lat", unit: "lat" },
    ],
    "Koszt wapnowania:",
    "zł/ha",
    "",
    "one-check",
    (a, b, c, d, e) => (a * b + c + d * b) / e
  );
  new CalculatorBlock(
    "#miedzyplon",
    "międzyplon",
    [
      { id: "cena-nasion", name: "Cena nasion:", placeholder: "za 1 kg nas. międzypl.", unit: "zł/kg" },
      { id: "dawka-ha-miedzyplon", name: "Dawka nasion na ha:", placeholder: "dawka nasion", unit: "kg/ha" },
      { id: "koszt-siewu", name: "Koszt siewu:", placeholder: "koszt siewnika na 1 ha", unit: "zł/ha" },
      { id: "czestotliwosc-miedzyplonu", name: "Częstotliwość:", placeholder: "co ile lat", unit: "lat" },
    ],
    "Koszt międzyplonu:",
    "zł/ha",
    "",
    "one-check",
    (a, b, c, d) => (a * b + c) / d
  );
  new CalculatorBlock(
    "#nawozy-naturlane",
    "nawozy naturalne",
    [
      { id: "cena-nawozu", name: "Cena nawozu:", placeholder: "cena 1 t naw. natur.", unit: "zł/t" },
      { id: "dawka-ha-nawozu", name: "Dawka na ha:", placeholder: "dawka naw. na 1 ha", unit: "t, m³/ha" },
      { id: "koszt-stosowania", name: "Koszt stosowania:", placeholder: "koszt rozrzuc./rozl.", unit: "zł/ha" },
      { id: "koszt-zaladunku", name: "Koszt załadunku:", placeholder: "koszt załad./pomp.", unit: "zł/t, m³" },
      { id: "czestotliowsc-nawozu", name: "Częstotliwość:", placeholder: "co ile lat", unit: "lat" },
    ],
    "Koszt naw. natur.:",
    "zł/ha",
    "",
    "one-check",
    (a, b, c, d, e) => (a * b + c + d * b) / e
  );
  new CalculatorBlock(
    "#zabiegi-jesienne",
    "zabiegi jesienne",
    [
      { id: "uprawa-po-przedplonie", name: "Uprawa po przedplonie:", placeholder: "koszt upr. ściern.", unit: "zł/ha" },
      { id: "uprawa-gleboka", name: "Uprawa głęboka:", placeholder: "koszty upr. głęb.", unit: "zł/ha" },
      { id: "mulczowanie", name: "Mulczowanie międzyplonu:", placeholder: "koszt mulczow.", unit: "zł/ha" },
    ],
    "Koszt zab. jesiennych",
    "zł/ha",
    "",
    "all-check",
    (a, b, c) => a + b + c
  );
  new CalculatorBlock(
    "#glifosat",
    "glifosat",
    [
      { id: "herbicyd-glifosan", name: "Herbicyd z glifosatem:", placeholder: "cena herb. z glif.", unit: "zł/l" },
      { id: "dawka-herbicydu", name: "Dawka herbicydu na ha:", placeholder: "dawka herb. z glif.", unit: "l/ha" },
      { id: "adiuwant-glifosan", name: "Adiuwant do glifosatu:", placeholder: "cena adiuwanta", unit: "l, kg/ha" },
      { id: "dawka-adiuwanta", name: "Dawka adiuwanta na ha:", placeholder: "dawka adiuwanta", unit: "l, kg/ha" },
    ],
    "Koszt glifosatu",
    "zł/ha",
    "",
    "one-check",
    (a, b, c, d) => a * b + c * d
  );
  new CalculatorBlock(
    "#material-siewny",
    "materiał siewny",
    [
      { id: "cena-nasion-material", name: "Cena nasion:", placeholder: "za 1 kg lub js.", unit: "zł/kg, js." },
      { id: "dawka-nasion-na-ha", name: "Dawka nasion na ha:", placeholder: "dawka kg lub js. na ha", unit: "kg, js./ha" },
      { id: "cena-szczepionki", name: "Cena szczepionki:", placeholder: "cena szcz. bakteryj.", unit: "zł/l, kg" },
      { id: "dawka-szczepionki", name: "Dawka szczepionki:", placeholder: "dawka szczepionki", unit: "l, kg/100 kg" },
      { id: "Cena zaprawy nasiennej", name: "Cena zaprawy nasiennej:", placeholder: "cena zaprawy", unit: "zł/l, kg" },
      { id: "dawka-zaprawy", name: "Dawka zaprawy:", placeholder: "dawka zaprawy", unit: "l, kg/100 kg" },
    ],
    "Koszt nasion",
    "zł/ha",
    "",
    "one-check",
    (a, b, c, d, e, f) => a * b + (c * d * b) / 100 + (e * f * b) / 100
  );
  new CalculatorBlock(
    "#zabiegi-wiosenne",
    "zabiegi wiosenne",
    [
      { id: "plytka-uprawa", name: "Płytka uprawa:", placeholder: "koszt uprawy", unit: "zł/ha" },
      { id: "wiosenne-mulczowanie", name: "Wiosenne mulczowanie:", placeholder: "koszt mulcz.", unit: "zł/ha" },
      { id: "upr-przedsiewna", name: "Koszt upr. przedsiewnej:", placeholder: "koszt uprawy", unit: "zł/ha" },
      { id: "koszt-siewu-wiosna", name: "Koszt siewu:", placeholder: "koszt siewu", unit: "zł/ha" },
      { id: "koszt-opielania", name: "Koszt opielania:", placeholder: "koszt opielania", unit: "zł/ha" },
      { id: "korekta-opielania", name: "Korekta opielania:", placeholder: "koszt opielania", unit: "zł/ha" },
    ],
    "Koszt uprawy wiosennej",
    "zł/ha",
    "",
    "all-check",
    (a, b, c, d, e, f) => a + b + c + d + e + f
  );
  new CalculatorBlock(
    "#zbior",
    "zbiór",
    [
      { id: "cena-koszenia", name: "Cena koszenia:", placeholder: "koszt kombajnu na 1 ha", unit: "zł/ha" },
      { id: "koszt-kilometrowki", name: "Koszt kilometrówki:", placeholder: "stawka za km wewn. gosp.", unit: "zł/km" },
      { id: "dystans-transp", name: "Dystans transp. wewn.:", placeholder: "szacunkowy dystans", unit: "km" },
      { id: "cena-suszenia", name: "Cena suszenia:", placeholder: "koszt susz. tono-proc.", unit: "zł/t/%" },
      { id: "wilgt-zbior", name: "Wilgotność podczas zbioru:", placeholder: "", unit: "%" },
      { id: "wilgt-doc", name: "Wilgotność docelowa:", placeholder: "", unit: "%" },
    ],
    "Koszt zbioru",
    "zł/ha",
    "",
    "no-check",
    (a, b, c, d, e, f) => a + b * c + d * (e - f)
  );
  new CalculatorBlock(
    "#nawozenie-mineralne-zabieg",
    "zabieg nawożenia",
    [
      { id: "koszt-nawozenia", name: "Koszt zabiegu nawożenia:", placeholder: "koszt nawożenia na 1 ha", unit: "zł/ha" },
      { id: "czestotliwosc-nawozenia", name: "Częstotliwość zabiegu nawożenia:", placeholder: "ile razy na 1 ha", unit: "razy/ha" },
    ],
    "Koszt nawożenia",
    "zł/ha",
    "",
    "one-check",
    (a, b) => a * b
  );
  new CalculatorBlock(
    "#adiuwant-zabieg",
    "Zabieg opryskiwanie",
    [
      { id: "koszt-opryskiwania-ad", name: "Koszt zabiegu opryskiwania:", placeholder: "koszt oprysk. na 1 ha", unit: "zł/ha" },
      { id: "czestotliwosc-opryskiwania-ad", name: "Częstotliwość zabiegu opryskiwania:", placeholder: "ile razy na 1 ha", unit: "razy/ha" },
    ],
    "Koszt opryskiwania",
    "zł/ha",
    "",
    "one-check",
    (a, b) => a * b
  );
  new CalculatorBlock(
    "#biopreparat-zabieg",
    "Opryskiwanie biopreparatem",
    [
      { id: "koszt-opryskiwania-bio", name: "Koszt zabiegu opryskiwania:", placeholder: "koszt stosowania na 1 ha", unit: "zł/ha" },
      { id: "czestotliwosc-opryskiwania-bio", name: "Częstotliwość zabiegu opryskiwania:", placeholder: "ile razy na 1 ha", unit: "razy/ha" },
    ],
    "Koszt opryskiwania",
    "zł/ha",
    "",
    "one-check",
    (a, b) => a * b
  );
  document.querySelector("#podst-wsp-doch").value = "483.2";
  document.querySelector("#redystr").value = "168.79";
  document.querySelector("#stracz").value = "794.08";
  document.querySelector("#miedzyplony").value = "435.1";
  document.querySelector("#nawozenie-podst").value = "87.02";
  document.querySelector("#nawozenie-wapnow").value = "261.06";
  document.querySelector("#struktura").value = "225.01";
  document.querySelector("#systemy").value = "251.94";
  document.querySelector("#sloma-gleba").value = "134.6";
  document.querySelector("#integrowana").value = "818.92";
  document.querySelector("#biologiczna").value = "300.06";
  document.querySelector("#nawozenie").value = "75.01";

  new dynamicCalculatorBlock(
    "#nawozenie-mineralne",
    "Nawozy mineralne",
    [
      {
        id: "koszt-jednostkowy-nm",
        name: "Koszt jednostkowy:",
        placeholder: "koszt za 1 t",
        unit: "zł/t",
      },
      {
        id: "dawka-hektar-nm",
        name: "Dawka na hektar:",
        placeholder: "ile na 1 ha",
        unit: "kg/ha",
      },
    ],
    "nazwa nawozu",
    "Koszt:",
    "zł",
    (a, b) => a * b,
    1000
  );
  new dynamicCalculatorBlock(
    "#nawozenie-dolistne",
    "Nawozy dolistne",
    [
      {
        id: "koszt-jednostkowy-dl",
        name: "Koszt jednostkowy:",
        placeholder: "koszt za 1 l, kg:",
        unit: "zł/l, kg",
      },
      {
        id: "dawka-hektar-dl",
        name: "Dawka na hektar:",
        placeholder: "ile na 1 ha",
        unit: "l, kg/ha",
      },
    ],
    "nazwa nawozu",
    "Koszt:",
    "zł",
    (a, b) => a * b,
    1
  );
  new dynamicCalculatorBlock(
    "#adiuwant",
    "ŚOR i adiuwanty",
    [
      {
        id: "koszt-jednostkowy-ad",
        name: "Koszt jednostkowy:",
        placeholder: "koszt za l, kg:",
        unit: "zł/l, kg",
      },
      {
        id: "dawka-hektar-ad",
        name: "Dawka na hektar:",
        placeholder: "ile na 1 ha",
        unit: "l, kg/ha",
      },
    ],
    "nazwa środka",
    "Koszt:",
    "zł",
    (a, b) => a * b,
    1
  );
  new dynamicCalculatorBlock(
    "#biopreparat",
    "biopreparat",
    [
      {
        id: "koszt-jednostkowy-bio",
        name: "Koszt jednostkowy:",
        placeholder: "koszt za 1 l, kg:",
        unit: "zł/l, kg",
      },
      {
        id: "dawka-hektar-bio",
        name: "Dawka na hektar:",
        placeholder: "ile na 1 ha",
        unit: "l, kg/ha",
      },
    ],
    "nazwa biopreparatu",
    "Koszt:",
    "zł",
    (a, b) => a * b,
    1
  );
}

mainContentLoad();
document.querySelector("#reset").addEventListener("click", function () {
  document.querySelector("#przychody-z-plonu").innerHTML = "";
  document.querySelector("#doplaty").innerHTML = "";
  document.querySelector("#ekoschematy").innerHTML = "";
  document.querySelector("#badanie-gleby").innerHTML = "";
  document.querySelector("#wapno").innerHTML = "";
  document.querySelector("#miedzyplon").innerHTML = "";
  document.querySelector("#nawozy-naturlane").innerHTML = "";
  document.querySelector("#zabiegi-jesienne").innerHTML = "";
  document.querySelector("#glifosat").innerHTML = "";
  document.querySelector("#material-siewny").innerHTML = "";
  document.querySelector("#zabiegi-wiosenne").innerHTML = "";
  document.querySelector("#nawozenie-mineralne").innerHTML = "";
  document.querySelector("#nawozenie-dolistne").innerHTML = "";
  document.querySelector("#nawozenie-mineralne-zabieg").innerHTML = "";
  document.querySelector("#adiuwant-zabieg").innerHTML = "";
  document.querySelector("#biopreparat-zabieg").innerHTML = "";
  document.querySelector("#adiuwant").innerHTML = "";
  document.querySelector("#biopreparat").innerHTML = "";
  document.querySelector("#zbior").innerHTML = "";
  mainContentLoad();
});

function calculateSum() {
  let przychodElements = ["#przychody-z-plonu-result", "#doplaty-result", "#ekoschematy-result"];

  let przychod = przychodElements.reduce((sum, selector) => {
    let el = document.querySelector(selector);
    if (!el) return sum;
    let value = parseFloat(el.textContent.replace("zł/ha", "").replace(",", ".").replace(/\s/g, "")) || 0;
    return sum + value;
  }, 0);

  let kosztyElements = ["#badanie-gleby-result", "#wapno-result", "#miedzyplon-result", "#nawozy-naturlane-result", "#zabiegi-jesienne-result", "#glifosat-result", "#material-siewny-result", "#zabiegi-wiosenne-result", "#nawozenie-mineralne-result", "#nawozenie-mineralne-zabieg-result", "#nawozenie-dolistne-result", "#adiuwant-result", "#adiuwant-zabieg-result", "#biopreparat-result", "#biopreparat-zabieg-result", "#zbior-result"];

  let koszt = kosztyElements.reduce((sum, selector) => {
    let el = document.querySelector(selector);
    if (!el) return sum;

    let value = parseFloat(el.textContent.replace("zł/ha", "").replace(",", ".").replace(/\s/g, "")) || 0;

    let checkbox = document.querySelector(selector.replace("result", "checkbox"));

    if (!checkbox || checkbox.checked) {
      return sum + value;
    } else {
      return sum;
    }
  }, 0);

  if (!isNaN(przychod) && przychod !== 0 && przychod !== Infinity) {
    document.querySelector("#suma-przychodow").textContent = przychod.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł/ha";
  } else {
    document.querySelector("#suma-przychodow").textContent = "podaj wartości";
  }

  if (!isNaN(koszt) && koszt !== 0 && koszt !== Infinity) {
    document.querySelector("#suma-kosztow").textContent = koszt.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł/ha";
  } else {
    document.querySelector("#suma-kosztow").textContent = "podaj wartości";
  }

  let nadwyzka = przychod - koszt;
  if (!isNaN(nadwyzka) && nadwyzka !== 0 && nadwyzka !== Infinity) {
    document.querySelector("#nadwyzka").textContent = nadwyzka.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " zł/ha";
  } else {
    document.querySelector("#nadwyzka").textContent = "podaj wartości";
  }

  let plonMin = koszt / przychod;
  if (!isNaN(plonMin) && plonMin !== 0 && plonMin !== Infinity) {
    document.querySelector("#plon-min").textContent = plonMin.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " t/ha";
  } else {
    document.querySelector("#plon-min").textContent = "podaj wartości";
  }
}

document.addEventListener("click", calculateSum);
document.addEventListener("input", calculateSum);
document.addEventListener("change", calculateSum);

//nawożenie minerlane 1600 * 100 / 1000 -> 160
//mineralne i doslistne: "nazwa nawozu"
//ŚOR: "nazwa środka"
//biopreparat: "nazwa biopreparatu"
