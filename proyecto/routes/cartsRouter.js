import express from "express";
import CartsContainer from "../cartsContainer.js";
const cartsContainer = new CartsContainer("./carts.txt");
const { Router } = express;
export const cartRouter = Router();

// Endpoints Cart

cartRouter.get("/:cartId/videogames", (req, res) => {
	const cartId = parseInt(req.params.cartId);

	cartsContainer.getVideogamesByCartId(cartId, req, res);
});

cartRouter.post("/", (req, res) => {
	cartsContainer.createCart(req, res);
});

cartRouter.post("/:cartId/videogames", (req, res) => {
	const cartId = parseInt(req.params.cartId);

	cartsContainer.addVideogameToCart(cartId, req, res);
});

cartRouter.delete("/:cartId", (req, res) => {
	const cartId = parseInt(req.params.cartId);

	cartsContainer.deleteById(cartId, req, res);
});

cartRouter.delete("/:cartId/videogames/:videogameId", (req, res) => {
	const cartId = parseInt(req.params.cartId);
	const videogameId = parseInt(req.params.videogameId);

	cartsContainer.deleteVideogameInCartWithId(cartId, videogameId, req, res);
});
