const fs = require('fs');
fetch("https://ryizqbbjxjrxcortkshv.supabase.co/rest/v1/config_app", {
  method: "POST",
  headers: {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aXpxYmJqeGpyeGNvcnRrc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk3MzQsImV4cCI6MjA5MTkyNTczNH0.nhb-bPiPN_q29-LfdrnjtYLq4k38hFwuuYu6bjuDCUM",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
  },
  body: JSON.stringify({ id: 1, updated_at: new Date().toISOString() })
})
.then(async res => {
  console.log("Status:", res.status);
  console.log("Response:", await res.text());
})
.catch(err => console.error(err));
