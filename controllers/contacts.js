const { isNull } = require('util');
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all contacts
const getAll = async (req, res, next) => {
  
  const result = await mongodb.getDb().db("MarkContact").collection('Contacts').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

// Return one contact by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
  }
  const userId = new ObjectId(req.params.id);

  const result = await mongodb.getDb().db("MarkContact").collection('Contacts').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });

};

// Create one contact from body json
const createContact = async (req, res, next) => {

  // Create a Contact
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  };

  // Save Contact in the database
  const result = await mongodb.getDb().db("MarkContact").collection('Contacts').insertOne(contact);

  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'An error occurred while creating the contact.');
  }
};
  
// Update a single contact
const updateContact = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
  }

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
}; 

// Delete one Contact
const deleteContact = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid contact id to update a contact");
  }

  const userId = new ObjectId(req.params.id);
  
  const response = await mongodb.getDb().db("MarkContact").collection('Contacts').deleteOne({ _id: userId }, true);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while deleting the contact.');
  }
};

module.exports = { 
  getAll, 
  getSingle, 
  createContact, 
  updateContact, 
  deleteContact 
};

