const plaid = require("plaid");
const dotenv = require('dotenv');
dotenv.config();

/**
 * Configuration class for the Plaid Service 
 * 
 * @author rohan_bharti
 */

/**
 * Defining Plaid Service Constants
 */
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;

/**
 * Sets up the Plaid Client
 */
const plaidClient = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments.sandbox,
    { version: "2018-05-22" }
);

module.exports = plaidClient;