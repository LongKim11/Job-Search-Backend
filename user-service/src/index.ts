import app from './app';

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`🚀 User service started! Listening on http://localhost:${PORT}`);
});
