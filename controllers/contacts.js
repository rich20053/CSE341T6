const { isNull } = require('util');
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;
const { userValidationRules, validate } = require('../util/validator.js');

//app.post('/user', userValidationRules(), validate, (req, res) => {
//  User.create({
//    username: req.body.username,
//    password: req.body.password,
//  }).then(user => res.json(user))
//})
// Return all contacts
const getAll = async (req, res, next) => {
  
  try {
    const result = await mongodb.getDb().db("MarkContact").collection('Contacts').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  }
  catch (err) {
    res.status(500).json(err);
  }
};

// Return one contact by id
const getSingle = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDb()
      .db("MarkContact")
      .collection('Contacts')
      //.find({ _id: req.params.id });
      .find({ _id: userId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    });
  }
  catch (err) {
    res.status(500).json(err);
  }

};

// Create one contact from body json
const createContact = async (req, res, next) => {
  try {

    // Create a Contact
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };

    const errors = validate(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Save Contact in the database
    const result = await mongodb.getDb().db("MarkContact").collection('Contacts').insertOne(contact);

    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result.error || 'An error occurred while creating the contact.');
    }
  }
  catch (err) {
    res.status(500).json(err);
  }
};
  
// Update a single contact
const updateContact = async (req, res, next) => {
  try {
  
    const userId = new ObjectId(req.params.id);

    // Update a Contact
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
  
    // Update data in database
    const response = await mongodb.getDb().db("MarkContact").collection('Contacts').replaceOne({ _id: userId }, contact);
    //console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'An error occurred while updating the contact.');
    }
  }
  catch (err) {
    res.status(500).json(err);
  }
}; 

// Delete one Contact
const deleteContact = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
  
    const response = await mongodb.getDb().db("MarkContact").collection('Contacts').deleteOne({ _id: userId }, true);
    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'An error occurred while deleting the contact.');
    }
  }
  catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { 
  getAll, 
  getSingle, 
  createContact, 
  updateContact, 
  deleteContact 
};

