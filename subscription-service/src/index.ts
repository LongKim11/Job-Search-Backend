import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 3003;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Job Service running at http://localhost:${PORT}`);
  });
});
