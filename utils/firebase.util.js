const { initializeApp } = require('firebase/app');
const { getStorage, uploadBytes } = require('firebase/storage');

const {ProductImg} = require('../models/productImg.model')

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

// Storage service
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (img, productId) => {
    try {
        const imgsPromises = img.map(async img =>{
            const [filename, extension] =img.originalname.split('.');
            const productImg = `${
                process.env.NODE_ENV
            }/products/${productId}/${filename}-${Date.now()}.${extension}`;

            const imgRef = ref(storage, productImg);

            const result = await uploadBytes(imgRef, img.buffer);

            return await ProductImg.create({
                productId,
                imgUrl: result.metadata.fullPath,
            });
        });

        await Promise.all(imgsPromises)
    } catch (error) {
        console.log(error);
    }
}

module.exports = { storage, uploadProductImgs };