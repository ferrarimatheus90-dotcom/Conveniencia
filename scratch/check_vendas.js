const fs = require('fs');
fetch("https://ryizqbbjxjrxcortkshv.supabase.co/rest/v1/config_app?select=json_db", {
  headers: {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM"
  }
})
.then(res => res.json())
.then(data => {
  const vendas = data[0].json_db.vendas || [];
  console.log("Total de vendas no banco:", vendas.length);
  const ultimas = vendas.slice(-5);
  console.log("Ultimas 5 vendas:", JSON.stringify(ultimas, null, 2));
})
.catch(err => console.error(err));
