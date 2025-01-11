const menu = document.querySelector("menu");
const helpmenu = document.querySelector("#help-menu");
const wheelmenu = document.querySelector("#wheel-menu");
const listContainer = document.getElementById("list-container");
const timeInput = document.getElementById("timeInput");

let animation1 = "1s timer infinite";
let animation2 = "boardAppear 2s ease-in-out 1";
let animation3 = "boardDisappear 2s ease-in-out 1";
let animation4 = "questionAppear 2s ease-in-out 1";
let animation5 = "questionDisappear 2s ease-in-out 1";

let isMenuOpen = false;
let isHelpOpen = false;
let isWheelOpen = false;
let game = false;

let squares = [];
let players = [];

let selectedSquare = null;

let timers = 30;
let timerOfFirstPlayer = timers;
let timerOfSecondPlayer = timers;

let rowSize = 4;
let pointsPerWrongAnswer = 0;

let interval = 1000;
let firstInterval;
let secondInterval;

let currentPlayer;
let whoWon;

let firstPlayerScore = 0;
let secondPlayerScore = 0;

let firstColor = null;
let secondColor = null;

let firstName = null;
let secondName = null;

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

let tempIndex = players.length + 1;
while (players.length < rowSize ** 2) {
	players.push(`Гравець ${tempIndex}`);
	tempIndex++;
}

players.forEach((player, index) => {
	if (player) {
		createCards(player, index);
	}
});

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
			endGame();
			this.highlightNearby();
			this.highlightSelf();
			firstColor = this.element.style.backgroundColor;
			firstName = this.name;
			document.querySelector("#name-container-left").innerHTML = firstName;
		}
	}

	highlightNearby() {
		const top = this.index - rowSize;
		const bottom = this.index + rowSize;
		const left = this.index % rowSize !== 0 ? this.index - 1 : null;
		const right = (this.index + 1) % rowSize !== 0 ? this.index + 1 : null;
		const topLeft = this.index % rowSize !== 0 ? this.index - rowSize - 1 : null;
		const topRight = (this.index + 1) % rowSize !== 0 ? this.index - rowSize + 1 : null;
		const bottomLeft = this.index % rowSize !== 0 ? this.index + rowSize - 1 : null;
		const bottomRight = (this.index + 1) % rowSize !== 0 ? this.index + rowSize + 1 : null;

		const nearbyIndices = [top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight].filter((i) => i !== null && i >= 0 && i < squares.length);

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
		fieldHide();
		questionAppear();
		secondName = this.name;
		document.querySelector("#name-container-right").innerHTML = secondName;
		game = true;
		setTimeout(() => {
			firstInterval = setInterval(() => {
				if (timerOfFirstPlayer > 0) {
					timerOfFirstPlayer--;
					document.getElementById("timer-left").innerHTML = formatTime(timerOfFirstPlayer);
					document.getElementById("timer-left").style.animation = animation1;
				} else {
					document.getElementById("timer-left").style.animation = "0s";
					updateAfterGameEnd();
					questionHideAndFieldAppear();
				}
			}, interval);
		}, 2000);

		mark.remove();
		calculateWinner();
	}
}

document.querySelector("#settings").addEventListener("click", () => {
	if (isMenuOpen) {
		menu.style.top = "-100dvh";
	} else {
		if (isHelpOpen) {
			helpmenu.style.top = "-100dvh";
			isHelpOpen = !isHelpOpen;
		}
		if (isWheelOpen) {
			wheelmenu.style.top = "-100dvh";
			isWheelOpen = !isWheelOpen;
		}
		menu.style.top = "0px";
	}

	isMenuOpen = !isMenuOpen;
});

document.getElementById("help").addEventListener("click", () => {
	if (isHelpOpen) {
		helpmenu.style.top = "-100dvh";
	} else {
		if (isMenuOpen) {
			menu.style.top = "-100dvh";
			isMenuOpen = !isMenuOpen;
		}
		if (isWheelOpen) {
			wheelmenu.style.top = "-100dvh";
			isWheelOpen = !isWheelOpen;
		}
		helpmenu.style.top = "0px";
	}

	isHelpOpen = !isHelpOpen;
});

document.getElementById("wheel-button").addEventListener("click", () => {
	if (isWheelOpen) {
		wheelmenu.style.top = "-100dvh";
	} else {
		if (isMenuOpen) {
			menu.style.top = "-100dvh";
			isMenuOpen = !isMenuOpen;
		}
		if (isHelpOpen) {
			helpmenu.style.top = "-100dvh";
			isHelpOpen = !isHelpOpen;
		}
		wheelmenu.style.top = "0px";
	}

	isWheelOpen = !isWheelOpen;
});

document.getElementById("playersInput").addEventListener("input", () => {
	let input = document.getElementById("playersInput").value;

	listContainer.innerHTML = "";

	while (input.endsWith(" ")) {
		input = input.slice(0, -1);
	}
	while (input.endsWith(",")) {
		input = input.slice(0, -1);
	}

	const elems = input.split(",").map((player) => player.trim());
	if (elems.length <= rowSize ** 2) {
		players = elems;
		let index = players.length + 1;

		while (players.length < rowSize ** 2) {
			players.push(`Гравець ${index}`);
			index++;
		}
		createSquares();
		setGridSize();
		elems.forEach((player, index) => {
			if (player) {
				createCards(player, index);
			}
		});
	}
	sections = [...players];
	drawWheel();
});

document.addEventListener("keydown", function (event) {
	clearIntervals();
	clearTimerAnimations();
	if (!game) return;

	if (event.key === " ") {
		if (currentPlayer === "firstPlayer") {
			firstPlayerScore++;
			playerSecondUpdateHTML();
		} else {
			secondPlayerScore++;
			playerFirstUpdateHTML();
		}
	} else {
		if (currentPlayer === "firstPlayer") {
			firstPlayerScore += pointsPerWrongAnswer;
			playerSecondUpdateHTML();
		} else {
			secondPlayerScore += pointsPerWrongAnswer;
			playerFirstUpdateHTML();
		}
	}
	scoreUpdateHTML();
});

timeInput.addEventListener("change", function () {
	if (Number(timeInput.value) >= 1 && Number.isInteger(Number(timeInput.value))) {
		timers = Number(timeInput.value);
		timerOfFirstPlayer = timers;
		timerOfSecondPlayer = timers;
		timersUpdateHTML();
	}
});

function calculateWinner() {
	clearTimerAnimations();
	if (firstPlayerScore > secondPlayerScore) {
		whoWon = "firstPlayer";
	} else if (secondPlayerScore > firstPlayerScore) {
		whoWon = "secondPlayer";
	} else {
		whoWon = "draw";
	}
	secondColor = selectedSquare.element.style.backgroundColor;
	if (whoWon == "firstPlayer") {
		selectedSquare.element.style.backgroundColor = firstColor;
		players.splice(players.indexOf(secondName), 1);
		let a = squares.filter((square) => square.color === secondColor);
		if (firstColor != secondColor) {
			a.forEach((el) => {
				el.name = firstName;
				el.element.style.backgroundColor = firstColor;
				el.color = firstColor;
				el.element.innerHTML = "";
			});
		}
	}
	if (whoWon == "secondPlayer") {
		selectedSquare.element.style.backgroundColor = secondColor;
		players.splice(players.indexOf(firstName), 1);
		let a = squares.filter((square) => square.color === firstColor);
		if (firstColor != secondColor) {
			a.forEach((el) => {
				el.name = secondName;
				el.element.style.backgroundColor = secondColor;
				el.color = secondColor;
				el.element.innerHTML = "";
			});
		}
	}
}

function createCards(player, index) {
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

function createSquares() {
	document.querySelector("#field").innerHTML = "";
	squares = [];
	for (let i = 0; i < rowSize ** 2; i++) {
		const element = new Square(i, players[i]);
		squares.push(element);
	}
}

function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
	return `${formattedMinutes}:${formattedSeconds}`;
}

function questionAppear() {
	setTimeout(() => {
		document.querySelector("#question").style.top = "50%";
		document.querySelector("#question").style.animation = animation4;
		document.querySelector("#question").style.display = "flex";
	}, interval * 2);
}

function questionHide() {
	document.querySelector("#question").style.top = "200%";
	document.querySelector("#question").style.animation = animation5;

	setTimeout(() => {
		document.querySelector("#question").style.display = "none";
	}, interval * 2);
}

function fieldAppear() {
	setTimeout(() => {
		document.querySelector("#field").style.animation = animation2;
		document.querySelector("#field").style.top = "50%";
	}, interval * 1.5);
}

function fieldHide() {
	document.querySelector("#field").style.animation = animation3;
	document.querySelector("#field").style.top = "-200%";
}

function questionHideAndFieldAppear() {
	questionHide();
	fieldAppear();
}

function timersUpdateHTML() {
	document.getElementById("timer-left").innerHTML = formatTime(timers);
	document.getElementById("timer-right").innerHTML = formatTime(timers);
}

function scoreUpdateHTML() {
	document.querySelector("#counter-left").innerHTML = firstPlayerScore;
	document.querySelector("#counter-right").innerHTML = secondPlayerScore;
}

function clearTimerAnimations() {
	document.getElementById("timer-left").style.animation = "0s";
	document.getElementById("timer-right").style.animation = "0s";
}

function setGridSize() {
	document.querySelector("#field").style.gridTemplate = `repeat(${rowSize}, 1fr) / repeat(${rowSize}, 1fr)`;
	squares[0].element.style.borderTopLeftRadius = "12px";
	squares[rowSize - 1].element.style.borderTopRightRadius = "12px";
	squares[rowSize ** 2 - rowSize].element.style.borderBottomLeftRadius = "12px";
	squares[rowSize ** 2 - 1].element.style.borderBottomRightRadius = "12px";
}

function endGame() {
	game = false;
	firstName = null;
	secondName = null;
	firstColor = null;
	secondColor = null;
	document.querySelector("#name-container-left").innerHTML = "";
	document.querySelector("#name-container-right").innerHTML = "";
	document.querySelectorAll(".mark").forEach((mark) => mark.remove());
	squares.forEach((square) => square.element.classList.remove("first"));
	squares.forEach((square) => square.element.classList.remove("selected"));
	squares.forEach((square) => square.element.classList.remove("highlight"));
	timerOfFirstPlayer = timers;
	timerOfSecondPlayer = timers;
	firstPlayerScore = 0;
	secondPlayerScore = 0;
	currentPlayer = "firstPlayer";
	whoWon = "secondPlayer";
	timersUpdateHTML();
	scoreUpdateHTML();
	clearTimerAnimations();
	clearIntervals();
	firstInterval = undefined;
	secondInterval = undefined;
}

document.getElementById("checkbox1").addEventListener("click", () => {
	if (rowSize == 5) {
		rowSize = 4;
	} else if (rowSize == 4) {
		rowSize = 5;
	}
	let input = document.getElementById("playersInput").value;
	const elems = input.split(",").map((player) => player.trim());
	document.querySelectorAll(".player-card").forEach((element) => {
		element.remove();
	});
	if (elems.length <= rowSize ** 2) {
		players = elems;
		let index = players.length + 1;

		while (players.length < rowSize ** 2) {
			players.push(`Гравець ${index}`);
			index++;
		}
		createSquares();
		setGridSize();
		elems.forEach((player, index) => {
			if (player) {
				createCards(player, index);
			}
		});
	}
	createSquares();
	setGridSize();
	endGame();
	questionHideAndFieldAppear();
	sections = [...players];
	drawWheel();
});

document.getElementById("checkbox2").addEventListener("click", () => {
	if (pointsPerWrongAnswer == 0) {
		pointsPerWrongAnswer = -1;
	} else if (pointsPerWrongAnswer == -1) {
		pointsPerWrongAnswer = 0;
	}
	endGame();
	questionHideAndFieldAppear();
});

function playerFirstUpdateHTML() {
	currentPlayer = "firstPlayer";
	firstInterval = setInterval(() => {
		if (timerOfFirstPlayer > 0) {
			timerOfFirstPlayer--;
			document.getElementById("timer-left").innerHTML = formatTime(timerOfFirstPlayer);
			document.getElementById("timer-left").style.animation = animation1;
		} else {
			timeOutSoEndGame();
		}
	}, interval);
}

function playerSecondUpdateHTML() {
	currentPlayer = "secondPlayer";
	secondInterval = setInterval(() => {
		if (timerOfSecondPlayer > 0) {
			timerOfSecondPlayer--;
			document.getElementById("timer-right").innerHTML = formatTime(timerOfSecondPlayer);
			document.getElementById("timer-right").style.animation = animation1;
		} else {
			timeOutSoEndGame();
		}
	}, interval);
}

function timeOutSoEndGame() {
	calculateWinner();
	updateAfterGameEnd();
	questionHideAndFieldAppear();
}

function updateAfterGameEnd() {
	firstPlayerScore = 0;
	secondPlayerScore = 0;
	timerOfFirstPlayer = timers;
	timerOfSecondPlayer = timers;
	game = false;
	clearIntervals();
}

function clearIntervals() {
	clearInterval(firstInterval);
	clearInterval(secondInterval);
}

createSquares();
timersUpdateHTML();
setGridSize();

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spin-button");
const resultDiv = document.getElementById("result");

let sections = [...players];
const sectionColors = [
	"#a46666",
	"#66a478",
	"#8a66a4",
	"#a49b66",
	"#669ca4",
	"#a4668b",
	"#79a466",
	"#6668a4",
	"#a47766",
	"#66a488",
	"#9a66a4",
	"#9da466",
	"#668ca4",
	"#a4667a",
	"#68a466",
	"#7666a4",
	"#a48866",
	"#66a499",
	"#a4669e",
	"#8da466",
	"#667ba4",
	"#a4666a",
	"#66a475",
	"#8666a4",
	"#a49966",
];

const wheelRadius = canvas.width / 2;
let currentAngle = 0;
let spinVelocity = 0;
let isSpinning = false;

function drawWheel() {
	const arcSize = (2 * Math.PI) / sections.length;

	for (let i = 0; i < sections.length; i++) {
		ctx.beginPath();
		ctx.fillStyle = sectionColors[i % sectionColors.length];
		ctx.moveTo(wheelRadius, wheelRadius);
		ctx.arc(wheelRadius, wheelRadius, wheelRadius, currentAngle + i * arcSize, currentAngle + (i + 1) * arcSize);
		ctx.fill();
		ctx.save();

		ctx.translate(wheelRadius, wheelRadius);
		ctx.rotate(currentAngle + i * arcSize + arcSize / 2);
		ctx.fillStyle = "#fff";
		ctx.font = "20px Montserrat, Arial";
		ctx.fillText(sections[i], wheelRadius / 2, 10);
		ctx.restore();
	}
}

function spinWheel() {
	if (isSpinning) return;
	isSpinning = true;
	spinVelocity = Math.random() * 0.3 + 0.7;
	let deceleration = 0.005;
	const spinInterval = setInterval(() => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		currentAngle += spinVelocity;
		drawWheel();
		spinVelocity -= deceleration;
		if (spinVelocity <= 0) {
			clearInterval(spinInterval);
			isSpinning = false;
			showResult();
		}
	}, 16);
}

function showResult() {
	const arcSize = (2 * Math.PI) / sections.length;
	const index = Math.floor((2 * Math.PI - (currentAngle % (2 * Math.PI))) / arcSize) % sections.length;
	resultDiv.textContent = `Грає: ${sections[index]}`;
}

drawWheel();

spinButton.addEventListener("click", spinWheel);
