const mongoose = require('mongoose');


const AdminSchema = mongoose.Schema({
	uname: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
        setDefaultOnInsert: Date.now()
    },
    dashboard: {
        graph: {
            start_date: {type: Date, setDefaultOnInsert: Date.now()},
            jan: {type: Number, default: 0},
            feb: {type: Number, default: 0},
            mar: {type: Number, default: 0},
            apr: {type: Number, default: 0},
            may: {type: Number, default: 0},
            jun: {type: Number, default: 0},
            jul: {type: Number, default: 0},
            aug: {type: Number, default: 0},
            sep: {type: Number, default: 0},
            oct: {type: Number, default: 0},
            nov: {type: Number, default: 0},
            dec: {type: Number, default: 0}
        },
        traffic: {
            date: { type: Date, setDefaultOnInsert: Date.now()},
            requests: {type: Number, default: 0}
        },
        sales: {
            week: {
                start_date: { type: Date, setDefaultOnInsert: Date.now()},
                revenue: {type: Number, default: 0}
            },
            month: {
                start_date: { type: Date, setDefaultOnInsert: Date.now()},
                revenue: {type: Number, default: 0}
            },
            year: {
                start_date: {type: Date, setDefaultOnInsert: Date.now()},
                revenue: {type: Number, default: 0}
            },
            all_time: {type: Number, default: 0}
        }
    },
	products: [
		{
			name: String,
			description: String,
			keys_overall: {type: Number, default: 0},
			revenue: {type: Number, default: 0},
			sold_keys: {
                num: {type: Number, default: 0},
                clients: {type: Number, default: 0},
				last_update: {type: Date, default: Date.now()}
			},
		},
	],
});


module.exports = mongoose.model('Admin', AdminSchema);