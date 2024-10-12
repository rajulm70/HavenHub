const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,
    },
    description : String, 
    image : {
        type : String,
        default : "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        set : (v)=>v===""
                    ?"https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60":
                    v,
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;