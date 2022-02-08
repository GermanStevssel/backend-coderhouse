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
