const express = require("express");
const clientController = require("../controllers/authController");

const router = express.Router();

router.post("/create-client", clientController.CreateClient);
router.patch("/uploadPhoto/:id/:folderId/:fileId", clientController.uploadP);
router.patch("/:id/folders", clientController.createFolder);
router.post("/:id/folders/:folderId/upload-filename", clientController.uploadFileName);

// Route to get all folders for a user
router.get("/:id/folders", clientController.getFolders);
module.exports = router;