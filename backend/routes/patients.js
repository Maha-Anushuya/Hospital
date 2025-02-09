const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Get all patients
router.route('/').get(async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Add a new patient
router.route('/add').post(async (req, res) => {
    const { name, age, gender } = req.body;

    const newPatient = new Patient({ name, age, gender });

    try {
        const savedPatient = await newPatient.save();
        res.json(savedPatient);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Update patient by ID
router.route('/update/:id').post(async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json('Patient not found');
        }

        patient.name = req.body.name;
        patient.age = req.body.age;
        patient.gender = req.body.gender;

        await patient.save();
        res.json('Patient updated!');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Delete patient by ID
router.route('/delete/:id').delete(async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json('Patient not found');
        }
        res.json('Patient deleted!');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;