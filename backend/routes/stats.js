const express = require('express');
const router = express.Router();
const {
  getSummary,
  getByEntity,
  getBySpecies,
  getByMonth,
  getByPresentation,
  getByBoat,
  getByPaymentMethod,
  getByStatus,
  getPaymentMethodDetails,
  getBillsByBoat
} = require('../controllers/statsController');

router.get('/summary', getSummary);
router.get('/by-entity', getByEntity);
router.get('/by-species', getBySpecies);
router.get('/by-month', getByMonth);
router.get('/by-presentation', getByPresentation);
router.get('/by-boat', getByBoat);
router.get('/by-payment-method', getByPaymentMethod);
router.get('/by-status', getByStatus);
router.get('/details-payment-method', getPaymentMethodDetails);
router.get('/bills-by-boat', getBillsByBoat);



module.exports = router;
