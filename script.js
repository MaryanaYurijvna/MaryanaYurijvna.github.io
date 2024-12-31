const settingsbutton = document.querySelector("#settings");
const menu = document.querySelector("menu");
const helpbutton = document.getElementById("help");
const helpmenu = document.querySelector("#help-menu");
const listContainer = document.getElementById("list-container");

let animation1 = "1s timer infinite";
let animation2 = "boardDisappear 2s ease-in-out 1";
let animation3 = "boardAppear 2s ease-in-out 1";
let animation4 = "questionDisappear 2s ease-in-out 1";
let animation5 = "questionAppear 2s ease-in-out 1";

let isMenuOpen = false;
let isHelpOpen = false;

let squares = [];
let players = [];
let index = players.length + 1;
while (players.length < 25) {
	players.push(`Гравець ${index}`);
	index++;
}

let colors = [
	"#eb9292",
	"#92ebab",
	"#c592eb",
	"#ebde92",
	"#92dfeb",
	"#eb92c6",
	"#adeb92",
	"#9294eb",
	"#ebaa92",
	"#92ebc3",
	"#dc92eb",
	"#e1eb92",
	"#92c8eb",
	"#eb92ae",
	"#95eb92",
	"#a892eb",
	"#ebc292",
	"#92ebdb",
	"#eb92e2",
	"#c9eb92",
	"#92b0eb",
	"#eb9297",
	"#92eba7",
	"#c092eb",
	"#ebda92",
];

players.forEach((player, index) => {
	if (player) {
		const card = document.createElement("div");
		const textInsideCard = document.createElement("div");
		card.appendChild(textInsideCard);
		card.className = "player-card";
		textInsideCard.textContent = player;
		listContainer.appendChild(card);
		textInsideCard.className = "player-name";
		const color = document.createElement("input");
		color.setAttribute("type", "color");
		color.setAttribute("value", colors[index]);
		color.addEventListener("change", function () {
			colors[index] = color.value;
			createSquares();
		});
		color.className = "color";
		card.appendChild(color);
	}
});

let selectedSquare = null;

let firstColor = null;
let secondColor = null;

let timers = 30;
document.getElementById("timer-left").innerHTML = formatTime(timers);
document.getElementById("timer-right").innerHTML = formatTime(timers);

let timerOfFirstPlayer = timers;
let timerOfSecondPlayer = timers;
let interval = 1000;

let firstPlayerScore = 0;
let secondPlayerScore = 0;

let currentPlayer = "firstPlayer";
let whoWon = "secondPlayer";

let firstInterval;
let secondInterval;
let game = false;

class Square {
	constructor(index, name) {
		this.index = index;
		this.color = colors[index];
		this.element = document.createElement("div");
		this.element.classList.add("square");
		this.element.style.backgroundColor = this.color;
		this.color = this.element.style.backgroundColor;
		this.element.addEventListener("click", this.clickHandler.bind(this));
		document.querySelector("#field").appendChild(this.element);
		this.name = name;
		if (this.name == undefined) {
			this.name = `Гравець ${this.index + 1}`;
		}
		this.element.innerHTML = this.name;
	}

	clickHandler() {
		if (this.element.classList.contains("selected")) return;

		if (this.element.classList.contains("highlight")) {
			this.selectSquare();
		} else {
			squares.forEach((square) => square.element.classList.remove("first"));
			squares.forEach((square) => square.element.classList.remove("selected"));
			squares.forEach((square) => square.element.classList.remove("highlight"));
			this.highlightNearby();
			this.highlightSelf();
			firstColor = this.element.style.backgroundColor;
			document.querySelectorAll(".mark").forEach((mark) => mark.remove());
			document.querySelector("#name-container-left").innerHTML = players[this.index];
			document.querySelector("#name-container-right").innerHTML = "";
			document.getElementById("timer-left").innerHTML = formatTime(timers);
			document.getElementById("timer-right").innerHTML = formatTime(timers);
			document.getElementById("timer-left").style.animation = "0s";
			document.getElementById("timer-right").style.animation = "0s";
			clearInterval(firstInterval);
			clearInterval(secondInterval);
			timerOfFirstPlayer = timers;
			timerOfSecondPlayer = timers;
			game = false;
			whoWon = "secondPlayer";
		}
	}

	highlightNearby() {
		const rowSize = 5;
		const top = this.index - rowSize;
		const bottom = this.index + rowSize;
		const left = this.index % rowSize !== 0 ? this.index - 1 : null;
		const right = (this.index + 1) % rowSize !== 0 ? this.index + 1 : null;

		const nearbyIndices = [top, bottom, left, right].filter((i) => i !== null && i >= 0 && i < squares.length);

		nearbyIndices.forEach((i) => {
			squares[i].element.classList.add("highlight");
		});
	}

	highlightSelf() {
		squares.forEach((square) => square.element.classList.remove("first"));
		this.element.classList.add("first");
	}

	selectSquare() {
		if (selectedSquare) {
			selectedSquare.element.classList.remove("selected");
		}

		this.element.classList.remove("highlight");
		this.element.classList.add("selected");
		squares.forEach((square) => square.element.classList.remove("highlight"));

		selectedSquare = this;

		const mark = document.createElement("div");
		mark.classList.add("mark");
		this.element.appendChild(mark);

		mark.addEventListener("click", () => {
			this.startGame(mark);
		});
	}

	startGame(mark) {
		document.querySelector("#field").style.animation = animation2;
		document.querySelector("#field").style.top = "-200%";

		setTimeout(() => {
			document.querySelector("#question").style.top = "50%";
			document.querySelector("#question").style.animation = animation5;
			document.querySelector("#question").style.display = "flex";
		}, interval * 2);

		document.querySelector("#name-container-right").innerHTML = players[this.index];
		game = true;
		setTimeout(() => {
			firstInterval = setInterval(() => {
				if (timerOfFirstPlayer > 0) {
					timerOfFirstPlayer--;
					document.getElementById("timer-left").innerHTML = formatTime(timerOfFirstPlayer);
					document.getElementById("timer-left").style.animation = animation1;
				} else {
					clearInterval(firstInterval);
					game = false;
					document.getElementById("timer-left").style.animation = "0s";
					questionHideAndFieldAppear();
				}
			}, interval);
		}, 2000);

		mark.remove();
		calculateWinner();
	}
}

function calculateWinner() {
	document.getElementById("timer-left").style.animation = "0s";
	document.getElementById("timer-right").style.animation = "0s";

	if (firstPlayerScore > secondPlayerScore) {
		whoWon = "firstPlayer";
	} else if (secondPlayerScore > firstPlayerScore) {
		whoWon = "secondPlayer";
	} else {
		whoWon = "draw";
	}

	if (whoWon == "firstPlayer") {
		secondColor = selectedSquare.element.style.backgroundColor;
		selectedSquare.element.style.backgroundColor = firstColor;
		let a = squares.filter((square) => square.color === secondColor);
		if (firstColor != secondColor) {
			a.forEach((el) => {
				el.element.style.backgroundColor = firstColor;
				el.color = firstColor;
				el.element.innerHTML = "";
			});
		}
	}
	if (whoWon == "secondPlayer") {
		secondColor = selectedSquare.element.style.backgroundColor;
		selectedSquare.element.style.backgroundColor = secondColor;
		let a = squares.filter((square) => square.color === firstColor);
		if (firstColor != secondColor) {
			a.forEach((el) => {
				el.element.style.backgroundColor = secondColor;
				el.color = secondColor;
				el.element.innerHTML = "";
			});
		}
	}
}

function createSquares() {
	document.querySelector("#field").innerHTML = "";
	squares = [];
	for (let i = 0; i < 25; i++) {
		const element = new Square(i, players[i]);
		squares.push(element);
	}
}

createSquares();

settingsbutton.addEventListener("click", () => {
	if (isMenuOpen) {
		menu.style.top = "-100dvh";
	} else {
		if (isHelpOpen) {
			helpmenu.style.top = "-100dvh";
			isHelpOpen = !isHelpOpen;
		}
		menu.style.top = "0px";
	}

	isMenuOpen = !isMenuOpen;
});

document.getElementById("playersInput").addEventListener("input", () => {
	let input = document.getElementById("playersInput").value;

	listContainer.innerHTML = "";

	if (input.endsWith(",")) {
		input = input.slice(0, -1);
	}

	const elems = input.split(",").map((player) => player.trim());
	if (elems.length <= 25) {
		players = elems;
		let index = players.length + 1;

		while (players.length < 25) {
			players.push(`Гравець ${index}`);
			index++;
		}
		createSquares();
		elems.forEach((player, index) => {
			if (player) {
				const card = document.createElement("div");
				const textInsideCard = document.createElement("div");
				card.appendChild(textInsideCard);
				card.className = "player-card";
				textInsideCard.textContent = player;
				listContainer.appendChild(card);
				textInsideCard.className = "player-name";
				const color = document.createElement("input");
				color.setAttribute("type", "color");
				color.setAttribute("value", colors[index]);
				color.addEventListener("change", function () {
					console.log("bara");
					colors[index] = color.value;
					createSquares();
				});
				color.className = "color";
				card.appendChild(color);
			}
		});
	}
});

helpbutton.addEventListener("click", () => {
	if (isHelpOpen) {
		helpmenu.style.top = "-100dvh";
	} else {
		if (isMenuOpen) {
			menu.style.top = "-100dvh";
			isMenuOpen = !isMenuOpen;
		}
		helpmenu.style.top = "0px";
	}

	isHelpOpen = !isHelpOpen;
});

document.addEventListener("keydown", function (event) {
	clearInterval(firstInterval);
	clearInterval(secondInterval);
	document.getElementById("timer-left").style.animation = "0s";
	document.getElementById("timer-right").style.animation = "0s";
	if (!game) return;

	if (event.key === " ") {
		if (currentPlayer === "firstPlayer") {
			firstPlayerScore++;
			currentPlayer = "secondPlayer";
			secondInterval = setInterval(() => {
				if (timerOfSecondPlayer > 0) {
					timerOfSecondPlayer--;
					document.getElementById("timer-right").innerHTML = formatTime(timerOfSecondPlayer);
					document.getElementById("timer-right").style.animation = animation1;
				} else {
					clearInterval(firstInterval);
					clearInterval(secondInterval);
					game = false;
					calculateWinner();
					firstPlayerScore = 0;
					secondPlayerScore = 0;
					timerOfFirstPlayer = timers;
					timerOfSecondPlayer = timers;
					questionHideAndFieldAppear();
				}
			}, interval);
		} else {
			secondPlayerScore++;
			currentPlayer = "firstPlayer";
			firstInterval = setInterval(() => {
				if (timerOfFirstPlayer > 0) {
					timerOfFirstPlayer--;
					document.getElementById("timer-left").innerHTML = formatTime(timerOfFirstPlayer);
					document.getElementById("timer-left").style.animation = animation1;
				} else {
					clearInterval(firstInterval);
					clearInterval(secondInterval);
					game = false;
					calculateWinner();
					firstPlayerScore = 0;
					secondPlayerScore = 0;
					timerOfFirstPlayer = timers;
					timerOfSecondPlayer = timers;
					questionHideAndFieldAppear();
				}
			}, interval);
		}
	} else {
		if (currentPlayer === "firstPlayer") {
			firstPlayerScore--;
			currentPlayer = "secondPlayer";
			secondInterval = setInterval(() => {
				if (timerOfSecondPlayer > 0) {
					timerOfSecondPlayer--;
					document.getElementById("timer-right").innerHTML = formatTime(timerOfSecondPlayer);
					document.getElementById("timer-right").style.animation = animation1;
				} else {
					clearInterval(firstInterval);
					clearInterval(secondInterval);
					game = false;
					calculateWinner();
					firstPlayerScore = 0;
					secondPlayerScore = 0;
					timerOfFirstPlayer = timers;
					timerOfSecondPlayer = timers;
					questionHideAndFieldAppear();
				}
			}, interval);
		} else {
			secondPlayerScore--;
			currentPlayer = "firstPlayer";
			firstInterval = setInterval(() => {
				if (timerOfFirstPlayer > 0) {
					timerOfFirstPlayer--;
					document.getElementById("timer-left").innerHTML = formatTime(timerOfFirstPlayer);
					document.getElementById("timer-left").style.animation = animation1;
				} else {
					clearInterval(firstInterval);
					clearInterval(secondInterval);
					game = false;
					calculateWinner();
					firstPlayerScore = 0;
					secondPlayerScore = 0;
					timerOfFirstPlayer = timers;
					timerOfSecondPlayer = timers;
					questionHideAndFieldAppear();
				}
			}, interval);
		}
	}

	document.querySelector("#correct-counter-left").innerHTML = firstPlayerScore;
	document.querySelector("#correct-counter-right").innerHTML = secondPlayerScore;
});

document.getElementById("timeInput").addEventListener("change", function () {
	timers = Number(document.getElementById("timeInput").value);
	timerOfFirstPlayer = timers;
	timerOfSecondPlayer = timers;
	document.getElementById("timer-left").innerHTML = formatTime(timers);
	document.getElementById("timer-right").innerHTML = formatTime(timers);
});

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
	return `${formattedMinutes}:${formattedSeconds}`;
}

function questionHideAndFieldAppear() {
	console.log("why");
	document.querySelector("#question").style.top = "200%";
	document.querySelector("#question").style.animation = animation4;
	setTimeout(() => {
		document.querySelector("#field").style.animation = animation3;
		document.querySelector("#field").style.top = "50%";
	}, interval * 1.5);

	setTimeout(() => {
		document.querySelector("#question").style.display = "none";
	}, interval * 2);
}
