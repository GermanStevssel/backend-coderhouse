const socket = io.connect();

const date = new Date();
const clientEmail = document.querySelector("#email"); //accedo en el DOM al objeto input
const message = document.querySelector("#message"); //accedo en el DOM al objeto input
const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const sendClientMsg = () => {
	if (clientEmail.value !== "" && clientEmail.value.match(mailFormat)) {
		/*Todo lo que se carga y capta el evento input, lo envío con un evento llamado "clientMsg" con
    el valor del input, input.value */
		socket.emit("clientMsg", {
			date: date,
			clientEmail: clientEmail.value,
			message: message.value,
		});

		message.value = "";
	} else {
		console.error("Formato incorrecto de email");
		alert(
			"El formato de email ingresado no es correcto, ingreselo nuevamente!"
		);
	}
};

document.querySelector("#sendMsg").addEventListener("click", () => {
	// agrego un evento de click en el objeto del DOM button
	sendClientMsg();
});

const writeMsgs = (msgs) => {
	const msgsHTML = msgs
		.map(
			(msg) =>
				`Fecha: ${msg.date} - Nombre: ${msg.clientEmail} -> Mensaje: ${msg.message}`
		)
		.join("<br>");
	document.querySelector("p").innerHTML = msgsHTML;
};

socket.on("ServerMsgs", (msgs) => {
	writeMsgs(msgs);
});

const title = document.querySelector("#title");
const price = document.querySelector("#price");
const thumbnail = document.querySelector("#thumbnail");

const addProduct = (evt) => {
	let videogame = {
		title: title.value,
		price: price.value,
		thumbnail: thumbnail.value,
	};

	socket.emit("newVideogame", videogame);
	title.value = "";
	price.value = "";
	thumbnail.value = "";
};

const renderTable = (data) => {
	const videogamesHTML = data
		.map((elem) => {
			return `<tr>
				<td>${elem.title}</td>
				<td>${elem.price}</td>
				<td class="d-flex justify-content-center">
					<img src=${elem.thumbnail} width="60px" height="60px" />
				</td>
				</tr>`;
		})
		.join(" ");
	console.log(videogamesHTML);
	document.querySelector("#videogames").value = "";
	document.querySelector("#videogames").innerHTML = videogamesHTML;
};

socket.on("videogames", (videogames) => {
	console.log(videogames);
	renderTable(videogames);
});
