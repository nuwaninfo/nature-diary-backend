import multer, { type Multer, type StorageEngine } from "multer";
import crypto from "crypto";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Storing file to images/ directory", file.originalname);
    cb(null, "./images");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = crypto.randomBytes(12).toString("hex");
    const newName = `${Date.now()}-${unique}${ext}`;
    cb(null, newName);
  },
});

const upload: Multer = multer({ storage });

export default upload;
