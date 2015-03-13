// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
 // connect to our database

var port = process.env.PORT || 1010;        // set our port

var Wolf     = require('./app/models/wolf');
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /wolves
// ----------------------------------------------------
router.route('/wolves')

    // create a wolf (accessed at POST http://localhost:8080/api/wolves)
    .post(function(req, res) {
        
        var wolf = new Wolf();      // create a new instance of the wolf model
        wolf.name = req.body.name;  // set the wolves name (comes from the request)

        // save the wolf and check for errors
        wolf.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Wolf created!' });
        });
        
    })

     // get all the wolves (accessed at GET http://localhost:8080/api/wolves)
    .get(function(req, res) {
        Wolf.find(function(err, wolves) {
            if (err)
                res.send(err);

            res.json(wolves);
        });
    });

router.route('/wolves/:wolf_id')

    // get the wolf with that id (accessed at GET http://localhost:8080/api/wolves/:wolf_id)
    .get(function(req, res) {
        Wolf.findById(req.params.wolf_id, function(err, wolf) {
            if (err)
                res.send(err);
            res.json(wolf);
        });
    })

    // update the wolf with this id (accessed at PUT http://localhost:8080/api/wolves/:wolf_id)
    .put(function(req, res) {

        // use our wolf model to find the wolv we want
        Wolf.findById(req.params.wolf_id, function(err, wolf) {

            if (err)
                res.send(err);

            wolf.name = req.body.name;  // update the wolves info

            // save the wolf
            wolf.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Wolf updated!' });
            });

        });
    })

    // delete the wolf with this id (accessed at DELETE http://localhost:8080/api/wolves/:wolf_id)
    .delete(function(req, res) {
        Wolf.remove({
            _id: req.params.wolf_id
        }, function(err, wolf) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
