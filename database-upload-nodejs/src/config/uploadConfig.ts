import path from 'path';
import multer from 'multer';

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    directory: tempFolder,

    storage: multer.diskStorage({
        destination: tempFolder,
        filename: (req, file, callback) => {
            return callback(null, file.originalname);
        }
    })
};