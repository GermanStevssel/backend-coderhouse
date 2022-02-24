import knex from "knex";

//mariadb debera persistir los productos
const mariaDBConfig = {
	client: "mysql",
	connection: {
		host: "127.0.0.1",
		port: 3306,
		user: "root",
		password: "",
		database: "products",
	},
};

export const mariaDBKnex = knex(mariaDBConfig);

//sqlite3 debera persistir los mensajes del websocket
const sqlite3Config = {
	client: "sqlite3",
	connection: {
		filename: "./ecommerce",
	},
};

export const sqlite3Knex = knex(sqlite3Config);
