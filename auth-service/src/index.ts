import app from './app';

const PORT = process.env.PORT || 6000;
console.log(`Starting server on port ${PORT}`);

app.listen(PORT, () => {
  console.log(
    `🚀 Authentication service started! Listening on http://localhost:${PORT}`
  );
});
