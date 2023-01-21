// script to take in webhook data

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/');
});

router.post('/', (req, res) => {
    const data = req.body;
    console.log(data.command);
    res.redirect('/');
});

module.exports = router;