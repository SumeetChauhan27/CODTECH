const https = require('https');

const urls = [
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80", // blanket
  "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80", // yoga mat
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80"  // water bottle
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`${url} -> ${res.statusCode}`);
      resolve();
    }).on('error', (e) => {
      console.log(`${url} -> ERROR ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const url of urls) {
    await checkUrl(url);
  }
}

run();
