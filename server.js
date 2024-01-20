1./********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Srushti Patel Student ID:117791228 Date: 19/01/2024

   Github link: https://github.com/SrushtiPatel1/listingsapisp
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ListingsDB = require("./modules/listingsDB");

// Load environment variables from .env file
dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB connection
const db = new ListingsDB();


// Routes
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// POST /api/listings
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = await db.addNewListing(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/listings
app.get("/api/listings", async (req, res) => {
  try {
    const { page, perPage, name } = req.query;
    const listings = await db.getAllListings(page, perPage, name);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/listings/:id
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /api/listings/:id
app.put('/api/listings/:id', async (req, res) => {
  try {
      const updatedListing = await db.updateListingById(req.body, req.params.id);
      if (updatedListing) {
          res.json(updatedListing);
      } else {
          res.status(404).send('Listing not found');
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});
// DELETE /api/listings/:id
app.delete("/api/listings/:id", async (req, res) => {
  try {
    const result = await db.deleteListingById(req.params.id);
    if (result.deletedCount > 0) {
      res.json({ message: "Listing deleted successfully" });
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res) => {
  res.status(404).send('Resource not found');
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });