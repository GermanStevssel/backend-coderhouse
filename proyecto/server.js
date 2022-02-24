import fs from "fs";
import Contenedor from "./container.js";
import express, { json, urlencoded } from "express";
const container = new Contenedor("./products.txt");
const app = express();
const { Router } = express;
const videogamesRouter = Router();
const cartRouter = Router();
const PORT = 8080 || process.env.PORT;

app.use("/center/videogames", videogamesRouter);
app.use("/center/cart", cartRouter);
app.use(express.static("public"));

videogamesRouter.use(json());
videogamesRouter.use(urlencoded({ extended: true }));
cartRouter.use(json());
cartRouter.use(urlencoded({ extended: true }));

let videogames = [];

let admin = true;

const authError = (req) => ({
	error: -1,
	description: `Ruta ${req.baseUrl} método ${req.method} no autorizada`,
});
// Endpoints Videogames
videogamesRouter.get("/", (req, res) => {
	res.send(container.getAll());
});

videogamesRouter.get("/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	const videogame = container.getById(videogameId);
	if (videogame) {
		res.send(`<div>
		<h1>${videogame.title}</h1>
		<h2>$ ${videogame.price}</h2>
		<img src="${videogame.thumbnail}" alt="Imagen de videjouego" />
		</div>`);
	} else {
		res.send({ error: "producto no encontrado" });
	}
});

videogamesRouter.post("/", (req, res) => {
	if (admin) {
		console.log(req.body);
		container.save(req.body);
		videogames.push(req.body);
		res.json(videogames);
	} else {
		res.send(authError(req));
	}
});

videogamesRouter.put("/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	if (admin) {
		container.updateById(videogameId, {
			...req.body,
			id: videogameId,
		});
		res.send(container.getById(videogameId));
	} else {
		res.send(authError(req));
	}
});

videogamesRouter.delete("/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	admin ? res.send(container.deleteById(videogameId)) : res.send(authError);
});

videogamesRouter.delete("/", (req, res) => {
	if (admin) {
		container.deleteAll();
		res.send({ result: "Todos los videojuegos han sido eliminados" });
	} else {
		res.send(authError(req));
	}
});

// Endpoints Cart

let carts = [];

const videogamesCollection = [];

const date = new Date();

const cartError = { error: -2, description: "Carrito no encontrado" };

cartRouter.get("/:cartId/videogames", (req, res) => {
	const cartId = parseInt(req.params.cartId);
	console.log(cartId);
	const userCart = carts.filter((cart) => {
		console.log(cart.id);
		return cart.id === cartId;
	});

	console.log(userCart[0].videogames);

	if (userCart?.length > 0) {
		userCart[0].videogames.length > 0
			? res.send(userCart[0].videogames)
			: { products: "No hay productos en este carrito" };
	} else {
		res.send(cartError);
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
			`Nuevo carrito creado, su número de id es: ${newCart.id.toString()}`
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
			`Nuevo carrito creado, su número de id es: ${newCart.id.toString()}`
		);
	}

	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

cartRouter.post("/:cartId/videogames", (req, res) => {
	const cartId = parseInt(req.params.cartId);
	const indexOfCart = carts.findIndex((cart) => cart.id === cartId);
	console.log(carts);

	console.log(indexOfCart);

	if (indexOfCart > -1) {
		videogamesCollection.push(req.body);
		carts[indexOfCart].videogames = videogamesCollection;
		res.send({ response: "Videojuego agregado al carrito" });
	} else {
		res.send(cartError);
	}
	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

cartRouter.delete("/:cartId", (req, res) => {
	const cartId = parseInt(req.params.cartId);
	const indexOfCart = carts.findIndex((cart) => cart.id === cartId);

	if (indexOfCart > -1) {
		carts.splice(indexOfCart, 1);
		res.send({ result: `Carrito eliminado: ${cartId}` });
	} else {
		res.send(cartError);
	}

	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

cartRouter.delete("/:cartId/videogames/:videogameId", (req, res) => {
	const cartId = parseInt(req.params.cartId);
	const videogameId = parseInt(req.params.videogameId);

	const indexOfCart = carts.findIndex((cart) => cart.id === cartId);

	if (indexOfCart > -1) {
		const videogamesInCart = carts[indexOfCart].videogames;
		const videogameIndex = videogamesInCart.findIndex(
			(videogame) => videogame.id === videogameId
		);
		if (videogameIndex > -1) {
			videogamesInCart.splice(videogameIndex, 1);
			res.send(carts);
		} else {
			res.send(cartError);
		}
	} else {
		res.send(cartError);
	}
	const textCarts = JSON.stringify(carts);
	fs.writeFileSync("./carts.txt", textCarts);
});

const server = app.listen(PORT, () => {
	console.log(`Express is listening in port http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
