import fs from "fs";
import Contenedor from "./templates/ejs/container.js";
const container = new Contenedor("./products.txt");
import express, { json, urlencoded } from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
const app = express();
const httpServer = new HttpServer(app); //le paso mis datos de app para levantar la aplicación
const io = new IOServer(httpServer); //establezco mi puente de datos en RT con el servidor http
const { Router } = express;
const router = Router();
const PORT = 8080;

app.use("/center", router); // las rutas de router inician con /center/....
const server = httpServer.listen(PORT, () => {
	console.log(`Express is listening in port http://localhost:${PORT}`);
});

app.use(express.static("public"));

server.on("error", (error) => console.log(`Error en servidor ${error}`));

router.use(json());
router.use(urlencoded({ extended: true }));

app.set("view engine", "ejs"); // registra el motor de plantillas
app.set("views", "./public/views"); // especifica el directorio de vistas

const messages = [];
const videogames = [];

io.on("connection", (socket) => {
	//connection se ejecuta la primera vez que se abre una nueva conexión
	//se imprimira solo la primera vez que se abra la conexión
	console.log("Nuevo cliente conectado");
	//Envío los mensajes existentes a todos los nuevos clientes
	socket.emit("ServerMsgs", messages);
	// socket.emit(, videogames)
	/*Escucho los mensajes enviados por el cliente con nombre "clientMsg" y lo broadcasteo 
  a todos los conectados al server con el evento llamado "ServerMsgs"*/
	socket.on("clientMsg", (data) => {
		// console.log("mensaje del cliente recibido - Se retransmitira");
		messages.push({
			date: data.date,
			clientEmail: data.clientEmail,
			message: data.message,
		});
		io.sockets.emit("ServerMsgs", messages);
		const stringMessages = JSON.stringify(messages);
		fs.writeFileSync("./assets/messages.txt", stringMessages);
	});
});

// Endpoints
app.get("/", (req, res) => {
	res.render("index", { videogames });
});

router.get("/productos", (req, res) => {
	res.send(container.getAll());
});

router.get("/productos/:productId", (req, res) => {
	const productId = parseInt(req.params.productId);
	const product = container.getById(productId);
	res.send(`<div>
	<h1>${product.title}</h1>
	<h2>$ ${product.price}</h2>
	<img src="${product.thumbnail}" alt="Imagen de videjouego" />
	</div>`);
});

router.post("/productos", (req, res) => {
	container.save(req.body);
	videogames.push(req.body);
	res.redirect("/");
});

router.put("/productos/:productId", (req, res) => {
	const productId = parseInt(req.params.productId);
	container.updateById(productId, {
		...req.body,
		id: productId,
	});
	res.send(container.getById(productId));
});

router.delete("/productos/:productId", (req, res) => {
	const productId = parseInt(req.params.productId);
	res.send(container.deleteById(productId));
});
