import express from "express";
import ProductsContainer from "../productsContainer.js";
const productsContainer = new ProductsContainer("./products.txt");
const { Router } = express;
export const videogamesRouter = Router();

let administrador = true;

const authError = (req) => ({
	error: -1,
	description: `Ruta ${req.baseUrl} método ${req.method} no autorizada`,
});

// Endpoints Videogames
videogamesRouter.get("/", (req, res) => {
	res.send(productsContainer.getAll());
});

videogamesRouter.get("/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	const videogame = productsContainer.getById(videogameId);
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
	if (administrador) {
		productsContainer.save(req.body);
		videogames.push(req.body);
		res.json(videogames);
	} else {
		res.send(authError(req));
	}
});

videogamesRouter.put("/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	if (administrador) {
		productsContainer.updateById(videogameId, {
			...req.body,
			id: videogameId,
		});
		res.send(productsContainer.getById(videogameId));
	} else {
		res.send(authError(req));
	}
});

videogamesRouter.delete("/:videogameId", (req, res) => {
	const videogameId = parseInt(req.params.videogameId);
	administrador
		? res.send(productsContainer.deleteById(videogameId))
		: res.send(authError);
});

videogamesRouter.delete("/", (req, res) => {
	if (administrador) {
		productsContainer.deleteAll();
		res.send({ result: "Todos los videojuegos han sido eliminados" });
	} else {
		res.send(authError(req));
	}
});
