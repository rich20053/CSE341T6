
/*** Contact ***/
const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');

const contactsController = require('../controllers/contacts');

router.get('/', contactsController.getAll);

router.get('/:id', contactsController.getSingle);

router.post('/', validation.contactCheck, contactsController.createContact);

router.put('/:id', validation.contactCheck, contactsController.updateContact);

router.delete('/:id', contactsController.deleteContact);

module.exports = router;

