import { mariaDBKnex } from "./db/database";

mariaDBKnex.schema
	.createTable("products", (table) => {
		table.increments("id"),
			table.string("timestamp"),
			table.string("code"),
			table.string("name"),
			table.string("description"),
			table.float("price"),
			table.number("stock");
	})
	.then(() => console.log("Tabla creada"))
	.catch((err) => console.err(err));

// mariaDBKnex.schema
// 	.dropTable("products")
// 	.then(() => console.log("Tabla products ha sido eliminada"));

const producto = {
	name: "articulo1",
	productTimestamp: "fyh",
	description: "Descripción",
	code: "Código",
	url: "link",
	price: 20,
	stock: 100,
};

// const producto = {
// 	name: "articulo2",
// 	productTimestamp: "fyh2",
// 	description: "Descripción2",
// 	code: "Código2",
// 	url: "link2",
// 	price: 10,
// 	stock: 80,
// };

mariaDBKnex("productos")
	.insert(producto)
	.then(() => console.log("Articulo insertado"))
	.catch((err) => {
		console.log(err);
		throw err;
	})
	.finally(() => {
		knexMariaDB.destroy();
	});

mariaDBKnex
	.from("productos")
	.select("*")
	.then((rows) => {
		for (row of rows) {
			console.log(`${row["id"]} ${row["nombre"]} ${row["precio"]}`);
		}
	})
	.catch((err) => {
		console.log(err);
		throw err;
	})
	.finally(() => {
		mariaDBKnex.destroy();
	});

mariaDBKnex
	.from("productos")
	.where("id", 3)
	.del()
	.then(() => console.log("Producto eliminado"))
	.catch((err) => {
		console.log(err);
		throw err;
	})
	.finally(() => {
		mariaDBKnex.destroy();
	});

mariaDBKnex("articulos")
	.where("id", 5)
	.update({ stock: 0 })
	.then(() => console.log("Stock actualizado"))
	.catch((err) => {
		console.log(err);
		throw err;
	})
	.finally(() => {
		mariaDBKnex.destroy();
	});
