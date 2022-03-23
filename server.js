import "dotenv/config";
import fs from "fs";
import mongoose from "mongoose";
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

// ---------- Mongo -----------
mongoose
	.connect(
		"mongodb+srv://mongoCoder:mongoCoder@stevssel-backend.qp3xl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	)
	.then(() => console.log("Base de datos MongoDB conectada"))
	.catch((err) => console.log(err));

import MongoContainer from "./containers/containerMongo.js";

import messagesSchema from "./models/messages";
const containerMongoMessages = new MongoContainer("messages", messagesSchema);

// ---------- Mongo -----------

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

let videogames = [];

const saveMessages = (message) => {
	containerMongoMessages.save(message);
};

import { normalize, denormalize, schema } from "normalizr";

import util from "util";

// Defino un esquema para cada mensaje

const messageSchema = new schema.Entity("message");

// Defino un esquema para cada autor //

const authorSchema = new schema.Entity(
	"author",
	{
		autor: messageSchema,
	},
	{ idAttribute: "email" }
);

const print = (obj) => {
	console.log(util.inspect(obj, false, 12, true));
};

io.on("connection", (socket) => {
	//connection se ejecuta la primera vez que se abre una nueva conexión
	//se imprimira solo la primera vez que se abra la conexión
	console.log("Nuevo cliente conectado");
	//Envío los mensajes existentes a todos los nuevos clientes
	socket.emit("ServerMsgs", containerMongoMessages.getAll());
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
		saveMessages(data);
		io.sockets.emit("ServerMsgs", containerMongoMessages.getAll());
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

// Desafio mock

import { Router } from "express";
import faker from "faker";

faker.locale = "es";

export const fakeProductsRouter = Router();

const generateFakeProducts = () => {
	return {
		name: faker.commerce.productName(),
		price: faker.commerce.price(),
		image: faker.image.image(),
	};
};

const getFakeProducts = (quantity) => {
	const products = [];
	for (let i = 0; i < quantity; i++) {
		products.push(generateFakeProducts());
	}
	return products;
};

// endpoint

fakeProductsRouter.get("/", (res, res) => {
	const products = getFakeProducts(5);
	res.render("products.test", { products });
});

const server = httpServer.listen(PORT, () => {
	console.log(`HTTP server is listening in port http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
