class DiceGame{
	constructor(playersCount, dicesPerPlayerCount){
		this.validation(playersCount, dicesPerPlayerCount);
		this.playersCount = playersCount;
		this.dicesPerPlayerCount = dicesPerPlayerCount;
	}

	//Validation of user insterted data
	validation(playersCount, dicesPerPlayerCount){
		const regEx = /^[0-9]+$/;
		const btnCreate = document.querySelector(".btn2");
		if (playersCount === "" || dicesPerPlayerCount === ""){
			this.showAlert(btnCreate, "Please, fill all the requed fields.");
			console.log("aaaaaa");
		} else if (!playersCount.match(regEx) || !dicesPerPlayerCount.match(regEx)){
			this.showAlert(btnCreate, "Please, enter the numbers only.");
		} else if ((dicesPerPlayerCount < 1 || dicesPerPlayerCount > 6) && (peopleCount < 2 || playersCount > 10)){
			this.showAlert(btnCreate, "Please, enter correct number of people or dices.");
		} else if (dicesPerPlayerCount < 1 || dicesPerPlayerCount > 6){
			this.showAlert(btnCreate, "Please, enter correct number of dices.");
		} else if (playersCount < 2 || playersCount > 10){
			this.showAlert(btnCreate, "Please, enter correct number of people.");
		} else{
			return;
		};
		throw "Invalid input data. The Game won't create";
	};


	//Create desired number of player instances
	createPlayers(){
		this.players = [];
		for (let i=0; i<this.playersCount; i++){
			this.players.push(
				this.player = {
					playerNumber: i+1,
					dices: this.createDicesPerPlayer(),
					active: true,
					winner: false
				}
			);
		};
		return this.players;
	};

	//Create desired number of dices per player
	createDicesPerPlayer(){
		let dicesPerPlayer = [];
		for (let i=0; i<this.dicesPerPlayerCount; i++){
			dicesPerPlayer.push(6);
		}
		return dicesPerPlayer;
	};

	//Initialize Game
	initializeGame(){
		this.createPlayers();
		this.renderPlayersCreate();
	};

	//Play
	play(){
		//set winner vaule of every player to false
		this.players.forEach(player => player.winner = false);

		//new random number for every dice of every player
		this.shake();

		//compare shaked results - find players with higher sum of their shaked numbers
		this.getWinners();

		//render shaked players to HTML
		this.renderPlayersShaked(this.players);

		//change shake button content
		const btn = document.querySelector(".btn");
		setTimeout(() => btn.innerHTML = "Shake again!", 1000);

		//show players with the highest sum in main heading
		this.renderMainHeading(true);

		//compare results, set the next shake
		this.setTheNextShake();
		console.log(this.players)
	};

	//get new numbers
	shake(){
		this.players.filter(player => player.active === true);
		this.players.forEach(player => {
			player.dices.forEach((element,i,array) => {
				array[i] = this.createRandomDiceState(6);
			})
			player.sum = player.dices.reduce((cv,ac) => cv + ac);
		});
	};

	createRandomDiceState(scale){
		return Math.floor(Math.random()*scale)+1;
	};

	//get winners
	getWinners(){
		this.winners = [];
		this.first = [];
		this.winners = [...this.players].filter(winner=> winner.active === true).sort((a,b) => b.sum-a.sum); //winners are vyhodnocovaní only from players with active status
		this.first = this.winners[0];
		this.winners = this.winners.filter((winner) => winner.sum === this.first.sum).map(winner => winner.playerNumber);
		console.log(this.winners);
		this.players.forEach(player => {
			if(this.winners.includes(player.playerNumber) === true){
				player.winner = true;
			}
		});
	};

	setTheNextShake(){
		if (this.winners.length === 1){
			// if there's only one winner => reset all player's status to active, so everyone can play again
			this.players.forEach((player) => player.active = true);
		} else {
			// if there's more than one winner => only those players status is left active, other players status is set to false
			this.players.forEach(player => {
				if(this.winners.includes(player.playerNumber) !== true){
					player.active = false;
				}
			});
		}
	};

	//Render to HTML
	renderPlayers(players, isShaked){
		const container = document.querySelector("main .container");
		players.forEach((item,index) => {
			const div = document.createElement("div");
			div.className = "dice";
			let p = document.createElement("p");
			p.innerHTML = `Player ${item.playerNumber}`;
			if(isShaked === true){
				setTimeout(()=> {
					p.innerHTML += ` (<strong>${item.sum}</strong>)`;
				}, 1000);
			};
			if(item.winner === true){
				setTimeout(() => {
					p.classList.add("winner");
				}, 1000)
			}
			div.appendChild(p);
			item.dices.forEach((el) => {
				const img = document.createElement("img");
				img.setAttribute("src", `images/dice${el}.png`);
				img.className = "img1";
				if(isShaked === true){
					img.setAttribute("src", `images/dice6.png`);
					setTimeout(() => img.classList.add("img-transform"), 0);
					setTimeout(() => img.setAttribute("src", `images/dice${el}.png`), 1000);
				}
				div.appendChild(img);
			});
			container.insertBefore(div, document.querySelector(".main-bottom"));
		});
	};

	//Render to HTML - created players by user
	renderPlayersCreate(){
		if(document.querySelector(".dice") === null){
			this.renderPlayers(this.players);
		} else{
			document.querySelectorAll(".dice").forEach(item => item.remove());
			this.renderPlayers(this.players);
		}

		this.renderMainHeading();

		//Just some DOM manimulation
		const btn = document.querySelector(".btn");
		const btnNewGame = document.querySelector(".btn3");
		const buttons = document.querySelector(".buttons");
		const headerCreate = document.querySelector(".header-create");
		const headerStart = document.querySelector(".header-start");
		const subheader = document.querySelector(".subheader");
		const form = document.querySelector("#form");
		const main = document.querySelector("main");

		main.classList.add("translateX0");
		setTimeout(() => {
			main.classList.add("main-overflow");
		}, 250);

		headerCreate.classList.add("translateX100");
		headerStart.classList.add("translateX0");
		buttons.classList.add("display-flex");
		subheader.classList.add("translateX100");
		form.reset();

		//Shake button
		btn.innerHTML = "Shake!"

		//Create new game button
		btnNewGame.addEventListener("click", ()=>{
			headerCreate.classList.remove("translateX100");
			headerStart.classList.remove("translateX0");
			subheader.classList.remove("translateX100");
		});
	};

	//Render to HTML - players shaked by computer
	renderPlayersShaked(shakedPlayers){
		shakedPlayers = shakedPlayers.filter(player => player.active === true);

		if(document.querySelector(".dice") === null){
			this.renderPlayers(shakedPlayers, true);
		} else{
			document.querySelectorAll(".dice").forEach(item => item.remove());
			this.renderPlayers(shakedPlayers, true);
		}
	};

	//show results in main heading
	renderMainHeading(isShaked){
		const title = document.querySelector(".buttons h1");
		title.innerHTML = "C'mon, show them who is the BOSS";
		title.classList.remove("winner");

		if(isShaked === true){
			if(this.winners.length === 1){
				setTimeout(()=>{
					title.innerHTML = `Player ${this.winners[0]} wins!`;
					title.classList.add("winner");
				}, 1000);
			} else{
				this.winners.sort((a,b) => a-b);
				setTimeout(()=>{
					title.innerHTML = `Draw! Players ${this.winners.slice(0, this.winners.length-1).join(", ")} and ${this.winners[this.winners.length-1]} go again!`;
					title.classList.add("winner");
				}, 1000);
			};
		}
	};

	//Show alert massage
	showAlert(button, massage){

		const subheader = document.querySelector(".subheader");
		const p = subheader.querySelector("p");
		subheader.style.background = "red";
		subheader.classList.add("subheader-visible");
		p.innerText = massage;
		button.classList.add("btn-shake-animation");
		setTimeout(()=>{
			button.classList.remove("btn-shake-animation");
		}, 820);
		setTimeout(()=>{
			subheader.classList.remove("subheader-visible");
		}, 3000);
	};
};

//////////////////////////////////////////////////////////////////
const form = document.querySelector("#form");
form.addEventListener("submit", (e) => {

	const peopleCount = document.querySelector("#playersCount").value;
	const dicesPerPlayerCount = document.querySelector("#dicesCount").value;

	e.preventDefault();

	try{
		let diceGame = new DiceGame(peopleCount, dicesPerPlayerCount);
		diceGame.initializeGame();

		const btn = document.querySelector(".btn");
		btn.addEventListener("click", (e) => {
			diceGame.play();
		});
  	} catch (error){
  		console.log(error);
  	}
});
