import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
	id: { type: String, require: true },
	author: {
		id: { type: String, require: true },
		nombre: { type: String, require: true, max: 100 },
		apellido: { type: String, require: true, max: 100 },
		edad: { type: Number, require: true, max: 110 },
		alias: { type: String, require: true, max: 100 },
		avatar: { type: String, require: true },
	},
	text: { type: String, require: true, max: 1000 },
});

export default messagesSchema;
