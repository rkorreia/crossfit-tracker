import { Hono } from 'hono';
import exercise from './routes/exercise.js';
import workoutLog from './routes/workoutLog.js';
import workoutSession from './routes/workoutSessionRoute.js';

const app = new Hono();

app.route('api/exercises', exercise);
app.route('api/workoutLogs', workoutLog);
app.route('api/workoutSessions', workoutSession);

export default app;
