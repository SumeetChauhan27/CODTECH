const https = require('https');

const products = [
  { id: "p001", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"] },
  { id: "p002", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"] },
  { id: "p003", images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"] },
  { id: "p004", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"] },
  { id: "p005", images: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80"] },
  { id: "p006", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"] },
  { id: "p007", images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80"] },
  { id: "p008", images: ["https://images.unsplash.com/photo-1580828369019-22204eb58c5c?w=800&q=80"] },
  { id: "p009", images: ["https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80"] },
  { id: "p010", images: ["https://images.unsplash.com/photo-1592432678016-e910b06b3848?w=800&q=80"] },
  { id: "p011", images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80"] },
  { id: "p012", images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80"] }
];

async function checkUrl(url, id) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 400) {
        console.log(`Product ${id}: ${url} -> ${res.statusCode}`);
      }
      resolve();
    }).on('error', (e) => {
      console.log(`Product ${id}: ${url} -> ERROR ${e.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const p of products) {
    await checkUrl(p.images[0], p.id);
  }
}

run();
