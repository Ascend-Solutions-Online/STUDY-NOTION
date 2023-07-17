// const mongoose = require("mongoose");
// require("dotenv").config();

// exports.connect = () => {
//     mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology:true,
//     })
//     .then(() => console.log("DB Connected Successfully"))
//     .catch( (error) => {
//         console.log("DB Connection Failed");
//         console.error(error);
//         process.exit(1);
//     } )
// };




const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const { pluralizeFileName } = require("../utils/pluralizeFileName");

require("dotenv").config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("DB Connected Successfully");

        // Load all model files
        const modelsFolderPath = path.join(__dirname, '../models');
        fs.readdirSync(modelsFolderPath).forEach((file) => {
            if (file.endsWith('.js')) {
                require(path.join(modelsFolderPath, file));
            }
        });

        // Check if the collection exists and create it if not
        const collections = await mongoose.connection.db.listCollections().toArray();
        const existingCollections = collections.map((collection) => collection.name);

        for (const file of fs.readdirSync(modelsFolderPath)) {
            if (file.endsWith('.js')) {
                const modelName = path.parse(file).name;
                const collectionName = pluralizeFileName(modelName).toLowerCase();
                console.log(`Checking collection: ${collectionName}`);
               
                if (!existingCollections.includes(collectionName)) {
                    try {
                        await mongoose.model(modelName).createCollection();
                        console.log(`Created collection: ${modelName}`);
                    } catch (error) {
                        console.error(`Error creating collection ${modelName}:`, error);
                    }
                }
            }
        }

        console.log('Collection creation completed');
    } catch (error) {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};
