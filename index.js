require('dotenv').config()

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey);

const express = require('express');
const ngrok = require('ngrok');
const bodyParser = require('body-parser');
const stripe = require('stripe')(stripeSecretKey);

(async function() {
  const url = await ngrok.connect();
})();


// Set up the express app
const app = express();


// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// routes endpoint

app.post('/api/purchase/', (req, res) => {
  return stripe.customers.create({
    email: 'paymenttest@test.com',
    source: req.body.tokenId
  })
  .then(customer => {
    stripe.charges.create({
      amount: req.body.amount, // Unit: cents
      currency: 'eur',
      customer: customer.id,
      source: customer.default_source.id,
      description: 'Test payment',
    })
  })
  .then(result => res.status(200).json(result))
});

app.listen(8000, () => {
    
  console.log('Listening to port 8000')
})
