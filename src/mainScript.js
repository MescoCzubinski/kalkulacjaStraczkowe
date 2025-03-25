function format(inputString) {
  return inputString
    .replace(/[^0-9.,]/g, "")
    .replace(/^(?!\.)/g, "")
    .replace(/,/g, ".")
    .replace(/^\.($|[^0-9])/, "0.")
    .replace(/\.{2,}/g, ".")
    .replace(/(.*?\..*?)\./g, "$1")
    .replace(/(\d+\.\d{2})\d*/g, "$1");
}
document.addEventListener("input", (event) => {
  console.log();
  if (!event.srcElement.classList.contains("textInput")) {
    const inputField = event.target;
    inputField.value = format(inputField.value);
  }
});
const visitedElements = document.querySelectorAll("input, select");
visitedElements.forEach((input) => {
  input.addEventListener("blur", function () {
    if (this.value) {
      this.classList.add("visited");
    } else {
      this.classList.remove("visited");
    }
  });
});
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("show-hide-button")) {
    let content = event.target.parentElement.nextElementSibling;
    content.style.height = content.style.height === "0px" || !content.style.height ? content.scrollHeight + "px" : "0px";
    event.target.textContent = content.style.height === "0px" ? "Rozwiń" : "Zwiń";
  }
});

function recalculateSectionHeight() {
  document.querySelectorAll(".show-hide-content").forEach((content) => {
    if (content.style.height !== "0px" && content.style.height) {
      content.style.height = content.scrollHeight + "px";
    }
  });
}
