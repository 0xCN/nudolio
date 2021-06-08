const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const KeySchema = mongoose.Schema({
	key: { type: String, required: true },
	product_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
	product_owner: { type: mongoose.SchemaTypes.ObjectId, required: true },
	date: { type: Date, default: Date.now() },
	activation_limit: { type: Number, default: 4 },
	price: { type: Number, required: true },
	hardware_ids: [String]
});

KeySchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Keys', KeySchema);