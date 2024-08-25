const fs = require('fs');
require('dotenv').config();

const envConfig = `export const environment = {
    production: false,
    stripePublishableKey: '${process.env.STRIPE_PUBLISHABLE_KEY}',
  };\n`;
  
fs.writeFileSync('./src/environments/environment.ts', envConfig);