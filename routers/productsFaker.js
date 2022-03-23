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
