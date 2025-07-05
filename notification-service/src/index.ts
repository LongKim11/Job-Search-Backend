import app from './app';

const PORT = process.env.PORT || 6005;
app.listen(PORT, () => {
  console.log(
    `🚀 Notification service started! Listening on http://localhost:${PORT}`
  );
});
