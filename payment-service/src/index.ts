import app from './app';

const PORT = process.env.PORT || 5003;
console.log(`Starting server on port ${PORT}`);

app.listen(PORT, () => {
  console.log(
    `🚀 Payment service started! Listening on http://localhost:${PORT}`
  );
});
