import { Hono } from 'hono';
import ExerciseService from '../services/ExerciseService.js';

const exercise = new Hono();

exercise.use('*', async (c, next) => {
    c.req.exerciseService = new ExerciseService(c.env.DB);
    await next();
});

exercise.get('/:exerciseName', async (c) => {
	const { exerciseName } = c.req.param();
    const response = await c.req.exerciseService.getExercisesByNamePattern(exerciseName);
    c.status(response.status)
    if (response.status !== 200) {
        return c.json(response)
    }
	c.status(200)
	return c.json(response.results);
});

exercise.get('/', async (c) => {
	const response = await c.req.exerciseService.getAllExercises();
    c.status(response.status)
    if (response.status !== 200) {
        return c.json(response)
    }
	return c.json(response.results);
});

exercise.post('/', async (c) => {
	const { name, description } = await c.req.json();

	if (!name) return c.text("'name' is required parameter for exercise");
	if (!description) return c.text("'description' is required parameter for exercise");

    const response = await c.req.exerciseService.addExercise(name, description);
    c.status(response.status)
    if (response.status !== 201) {
        return c.json(response)
    }
    return c.json(response.results)
});

export default exercise