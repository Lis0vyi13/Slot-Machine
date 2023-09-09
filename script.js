const form = document.querySelector(".form");
const slotItems = document.querySelectorAll(".slot-item__content");
const submitButton = document.querySelector('button[type="submit"]');
const balance = document.querySelector("#balance");
const valueBetInput = document.querySelector("#bet-value");
const rowAmountInput = document.querySelector("#row-amount");
const modal = document.querySelector(".modal");
const modalCloseButton = document.querySelector(".modal__close");
// icons
const seven = '<img src="icons/7.png" alt="#">';
const crown = '<img src="icons/crown.png" alt="#">';
const cherry = '<img src="icons/cherry.png" alt="#">';

const iconsArr = [seven, crown, cherry];

// modal
modal.addEventListener("click", function (e) {
  if (!e.target.closest(".modal__content") || e.target === modalCloseButton) {
    modal.classList.toggle("show");
  }
});

function changeCellsIcons() {
  slotItems.forEach(function (item) {
    let randomValue = Math.floor(Math.random() * iconsArr.length);
    item.innerHTML = iconsArr[randomValue];
    item.setAttribute("data", randomValue);
  });
}

function spin() {
  let count = 0;
  changeCellsIcons();

  const interval = setInterval(function () {
    count++;
    if (count < 3) {
      changeCellsIcons();
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

function getValues() {
  if (rowAmountInput.value > 0 && rowAmountInput.value < 4) {
    const betMoney = valueBetInput.value * rowAmountInput.value;

    if (parseInt(balance.textContent) < betMoney) {
      document.querySelector(".modal p").textContent = "Fail! You dont have enough money!";
      modal.classList.toggle("show");
      return false;
    }
    return true;
  }
  document.querySelector(".modal p").textContent = "Enter value (1-3)";
  modal.classList.toggle("show");

  return false;
}
let times = 0;
function compareCells([...arr]) {
  if (arr.length < 7) return times;
  let count = 0;

  for (let i = 3; i < arr.length; i += 3) {
    if (arr[0].getAttribute("data") === arr[i].getAttribute("data")) count++;
  }
  if (count === 2) times++;
  return compareCells(arr.slice(1));
}

const game = () => {
  let balanceValue = parseInt(balance.textContent);
  const betMoney = valueBetInput.value * rowAmountInput.value;
  return function updateBalance() {
    times = 0;
    const result = compareCells(slotItems);

    if (result === 0) {
      balanceValue -= betMoney;
      balance.innerHTML = balanceValue + "$";
      return;
    }

    if (rowAmountInput.value > result) {
      if (rowAmountInput.value - result === 2) {
        balanceValue -= valueBetInput.value;
      }
      if (rowAmountInput.value - result === 1) {
        balance.innerHTML = balanceValue + "$";
        return;
      }
      balance.innerHTML = balanceValue + "$";
      return;
    }

    balanceValue += betMoney;
    balance.innerHTML = balanceValue + "$";
  };
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!getValues()) return;
  const updateBalanceFunc = game();
  slotItems.forEach(function (item) {
    submitButton.style.backgroundColor = "rgb(30, 109, 30)";
    submitButton.style.pointerEvents = "none";
    item.classList.add("spin");
    spin();

    setTimeout(() => {
      item.classList.remove("spin");
      submitButton.style.backgroundColor = "rgb(24, 204, 24)";
      submitButton.style.pointerEvents = "all";
    }, 3000);
  });
  setTimeout(() => {
    updateBalanceFunc();
  }, 3000);
});
