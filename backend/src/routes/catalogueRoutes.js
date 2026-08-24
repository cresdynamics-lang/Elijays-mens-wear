const express = require('express');
const router = express.Router();
const catalogueController = require('../controllers/catalogueController');

router.get('/', catalogueController.getCatalogue);
router.get('/ads', catalogueController.getCatalogueAds);
router.get('/meta-products.csv', catalogueController.getMetaCatalogueCsv);

module.exports = router;
