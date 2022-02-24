import { sqlite3Knex } from "./db/database.js";

sqlite3Knex.schema
	.createTable("messages", (table) => {
		table.string("email");
		table.string("time");
		table.string("message");
		table.increments("id");
	})
	.then(() => console.log("Tabla mensajes creada"))
	.catch((error) => console.log(error));

sqlite3Knex.schema
	.dropTable("messages")
	.then(() => console.log("Tabla mensajes borrada"))
	.catch((err) => console.log(err));

const articulos = [
	{ nombre: "articulo1", codigo: "codigo1", precio: 1, stock: 30 },
	{ nombre: "articulo2", codigo: "codigo2", precio: 2, stock: 30 },
	{ nombre: "articulo3", codigo: "codigo3", precio: 3, stock: 30 },
	{ nombre: "articulo4", codigo: "codigo4", precio: 4, stock: 30 },
	{ nombre: "articulo5", codigo: "codigo5", precio: 5, stock: 30 },
];

sqlite3Knex("articulos")
	.insert(articulos)
	.then(() => console.log("Articulos insertados"))
	.catch((err) => {
		console.log(err);
		throw err;
	})
	.finally(() => {
		sqlite3Knex.destroy();
	});

sqlite3Knex
	.from("articulos")
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
		sqlite3Knex.destroy();
	});

sqlite3Knex
	.from("articulos")
	.where("id", "=", 3)
	.del()
	.then(() => console.log("Producto eliminado"))
	.catch((err) => {
		console.log(err);
		throw err;
	})
	.finally(() => {
		sqlite3Knex.destroy();
	});

sqlite3Knex
	.from("articulos")
	.where("id", "=", 5)
	.update({ stock: 0 })
	.then(() => console.log("Producto actualizado"))
	.catch((err) => {
		console.log(err);
		throw err;
	})
	.finally(() => {
		sqlite3Knex.destroy();
	});
