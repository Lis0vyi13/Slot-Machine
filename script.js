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
const plum = '<img src="icons/plum.png" alt="#">';
const grape = '<img src="icons/grape.png" alt="#">';
const diamond = '<img src="icons/diamond.png" alt="#">';
const apple = '<img src="icons/apple.png" alt="#">';
const lemon = '<img src="icons/lemon.png" alt="#">';
const watermelon = '<img src="icons/watermelon.png" alt="#">';

const iconsArr = [seven, crown, cherry, plum, grape, diamond, apple, lemon, watermelon];

// modal
modal.addEventListener("click", function (e) {
  if (!e.target.closest(".modal__content") || e.target === modalCloseButton) {
    modal.classList.toggle("show");
  }
});

function changeCellsIcons() {
  slotItems.forEach(function (item) {
    let randomValue = Math.floor(Math.random() * slotItems.length);
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
  const betMoney = valueBetInput.value * rowAmountInput.value;

  if (parseInt(balance.textContent) < betMoney) {
    modal.classList.toggle("show");
    return false;
  }
  return true;
}

function compareCells([...arr], times = 0) {
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
    const result = compareCells(slotItems);
    if (result === 0) {
      balanceValue -= betMoney;
    } else {
      balanceValue += betMoney;
    }
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
