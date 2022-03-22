import fs from "fs";

export default class Contenedor {
	constructor(fileName) {
		this.fileName = fileName;
		this.products = [];
	}
	getAll() {
		const fileContent = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
		this.products = fileContent;
		return this.products;
	}
	getById(id) {
		const products = this.getAll();
		const productFinded = products.find((product) => product.id === id);

		if (productFinded) {
			console.log(productFinded);
			return productFinded;
		} else {
			console.log("El producto no existe");
			return null;
		}
	}

	deleteById(id) {
		const products = this.getAll();
		const idExist = products.some((product) => product.id === id);

		if (!idExist) {
			console.log(`El producto con id ${id} no existe`);
			return;
		}

		const newProducts = products.filter((product) => product.id !== id);
		const textNewProducts = JSON.stringify(newProducts);
		fs.writeFileSync(this.fileName, textNewProducts);
	}

	deleteAll() {
		const emptyFile = JSON.stringify([]);
		try {
			fs.writeFileSync(this.fileName, emptyFile);
			console.log("Todos los productos han sido borrados");
		} catch (err) {
			console.error(err);
		}
	}

	updateById(id, newProduct) {
		const products = this.getAll();
		const productIndex = products.findIndex((product) => product.id === id);
		const idExist = products.some((product) => product.id === id);

		if (!idExist) {
			console.log(
				`El producto con id ${id} no existe, se guardara con un nuevo id`
			);
			this.save(newProduct);
		}
		if (productIndex > -1) {
			let id = products[productIndex].id;
			newProduct = { ...newProduct, id: id };
			products[productIndex] = newProduct;
			const textProducts = JSON.stringify(products);
			fs.writeFileSync("./products.txt", textProducts);
		}
	}

	save(product) {
		let id;
		const products = this.getAll();
		if (products.length === 0) {
			id = 1;
			const productWithId = { ...product, id: id };
			products.push(productWithId);
			const txtProduct = JSON.stringify(products);
			fs.writeFileSync(this.fileName, txtProduct);
		} else {
			id = products[products.length - 1].id + 1;
			const productWithId = { ...product, id: id };
			products.push(productWithId);
			const txtProduct = JSON.stringify(products);
			fs.writeFileSync(this.fileName, txtProduct);
		}
	}
}
