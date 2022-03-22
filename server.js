import "dotenv/config";
import fs from "fs";
import { mariaDBKnex } from "./db/database";
import { Container } from "./containers/containerKnex.js";
import express, { json, urlencoded } from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { fakeProductsRouter } from "./routers/productsFaker";
const container = new Container("./products.txt");
const app = express();
const httpServer = new HttpServer(app); //le paso mis datos de app para levantar la aplicación
const io = new IOServer(httpServer); //establezco mi puente de datos en RT con el servidor http
const { Router } = express;
const router = Router();
const videogamesRouter = Router();
const cartRouter = Router();
const PORT = 8080 || process.env.PORT;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api", router); // las rutas de router inician con /api/....
app.use("/api/productos", videogamesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/productos-test", fakeProductsRouter);
app.use(express.static("public"));

app.set("view engine", "ejs"); // registra el motor de plantillas
app.set("views", "./public/views"); // especifica el directorio de vistas

const messages = [];
let videogames = [];

const saveMessages = (message) => {
	mariaDBKnex("messages")
		.insert(message)
		.then(() => console.log("Mensaje guardado en la base de datos"))
		.catch((err) => {
			throw err;
		});
};

io.on("connection", (socket) => {
	//connection se ejecuta la primera vez que se abre una nueva conexión
	//se imprimira solo la primera vez que se abra la conexión
	console.log("Nuevo cliente conectado");
	//Envío los mensajes existentes a todos los nuevos clientes
	socket.emit("ServerMsgs", messages);
	socket.emit("videogames", videogames);
	socket.on("newVideogame", (data) => {
		let newID = videogames.length + 1;
		let newTitle = data.title;
		let newPrice = data.price;
		let newThumbnail = data.thumbnail;
		const videogame = {
			id: newID,
			title: newTitle,
			price: newPrice,
			thumbnail: newThumbnail,
		};
		videogames.push(videogame);
		io.sockets.emit("videogames", videogames);
	});
	/*Escucho los mensajes enviados por el cliente con nombre "clientMsg" y lo broadcasteo 
  a todos los conectados al server con el evento llamado "ServerMsgs"*/
	socket.on("clientMsg", (data) => {
		// console.log("mensaje del cliente recibido - Se retransmitira");
		messages.push({
			date: data.date,
			clientEmail: data.clientEmail,
			message: data.message,
		});
		saveMessages(data);
		io.sockets.emit("ServerMsgs", messages);
	});
});

let admin = true;
const authError = {
	error: -1,
	description: "No posee los permisos para llevar adelante esta acción",
};
// Endpoints Videogames
app.get("/", (req, res) => {
	res.render("index", { videogames });
});

videogamesRouter.get("/videogames", (req, res) => {
	res.send(container.getAll());
});

videogamesRouter.get("/videogames/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	const videogame = container.getById(videogameId);
	res.send(`<div>
	<h1>${videogame.title}</h1>
	<h2>$ ${videogame.price}</h2>
	<img src="${videogame.thumbnail}" alt="Imagen de videjouego" />
	</div>`);
});

videogamesRouter.post("/videogames", (req, res) => {
	if (admin) {
		container.save(req.body);
		videogames.push(req.body);
		res.redirect("/");
	} else {
		res.send(authError);
	}
});

videogamesRouter.put("/videogames/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	if (admin) {
		container.updateById(videogameId, {
			...req.body,
			id: videogameId,
		});
		res.send(container.getById(videogameId));
	} else {
		res.send(authError);
	}
});

videogamesRouter.delete("/videogames/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	admin ? res.send(container.deleteById(videogameId)) : res.send(authError);
});

// Endpoints Cart

const carts = []; // cartArrays

const videogamesColection = []; //productsArray

const date = new Date();

const userError = { error: -2, description: "Usuario no encontrado" };

cartRouter.get("/:userId/videogames", (req, res) => {
	const userId = parseInt(req.params.userId);
	const userCart = carts.filter((cart) => cart.id === userId);

	if (userCart.length > 0) {
		userCart[0].videogames.length > 0
			? res.send(userCart[0].videogames)
			: { products: "No hay productos en este carrito" };
	} else {
		res.send(userError);
	}
});

cartRouter.post("/", (req, res) => {
	if (carts.length === 0) {
		const newCart = {
			id: 1,
			cartTimeStamp: date.toLocaleString(),
			videogames: [],
		};
		carts.push(newCart);
		res.send(
			`Nuevo carrito creado, su númer de id es: ${newCart.id.toString()}`
		);
	} else {
		const indexOfLastElement = carts.length - 1;
		const newCart = {
			id: carts[indexOfLastElement].id + 1,
			cartTimeStamp: date.toLocaleString(),
			videogames: [],
		};
		carts.push(newCart);
		res.send(
			`Nuevo carrito creado, su númer de id es: ${newCart.id.toString()}`
		);
	}

	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

cartRouter.post("/:userId/videogames", (req, res) => {
	const userId = parseInt(req.params.userId);
	const indexOfCart = carts.findIndex((cart) => cart.id === userId);

	if (indexOfCart > -1) {
		videogamesColection.push(req.body);
		carts[indexOfCart].videogames = videogamesColection;
		res.redirect("/");
	} else {
		res.send(userError);
	}
	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

cartRouter.delete("/:userId", (req, res) => {
	const userId = parseInt(req.params.userId);
	const indexOfCart = carts.findIndex((cart) => cart.id === userId);

	if (indexOfCart > -1) {
		carts.splice(indexOfCart, 1);
		res.redirect("/");
	} else {
		res.send(userError);
	}

	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

cartRouter.delete("/:userId/videogames/:videogameId", (req, res) => {
	const userId = parseInt(req.params.userId);
	const videogameId = parseInt(req.params.videogameId);

	const indexOfCart = carts.findIndex((cart) => cart.id === userId);

	if (indexOfCart > -1) {
		const videogamesInCart = carts[indexOfCart].videogames;
		const videogameIndex = videogamesInCart.findIndex(
			(videogame) => videogame.id === videogameId
		);
		if (videogameIndex > -1) {
			videogamesInCart.splice(videogameIndex, 1);
			res.send(carts);
		} else {
			res.send(userError);
		}
	} else {
		res.send(userError);
	}
	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

const server = httpServer.listen(PORT, () => {
	console.log(`HTTP server is listening in port http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));