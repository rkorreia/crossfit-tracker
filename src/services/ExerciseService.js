class ExerciseService {
    constructor(db) {
        this.db = db;  // Save the db object for later use in the class methods
    }

    // Utility method to create a consistent response format
    createResponse(status, message, results = []) {
        if (status >= 400) {
            return {status, message}
        }
        return results;
    }

    // Method to get a specific exercise by name
    async getExercisesByName(exerciseName) {
        console.log(`[INFO] Fetching exercise by name: ${exerciseName}`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM exercises WHERE name = ?`)
                .bind(exerciseName)
                .all();

            if (results.length > 0) {
                console.log(`[INFO] Exercise found: ${results[0].name}`);
                return this.createResponse(200, 'Exercise found', results[0]);
            } else {
                console.log(`[WARN] No exercises found matching: ${exerciseName}`);
                return this.createResponse(404, 'No exercises found matching the pattern');
            }
        } catch (error) {
            console.error(`[ERROR] Failed to fetch exercise: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to get exercises by pattern (name contains a certain string)
    async getExercisesByNamePattern(exerciseName) {
        console.log(`[INFO] Fetching exercises by pattern: ${exerciseName}`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM exercises WHERE name LIKE ?`)
                .bind(`%${exerciseName}%`)
                .all();

            if (results.length > 0) {
                console.log(`[INFO] ${results.length} exercises found for pattern: ${exerciseName}`);
                return this.createResponse(200, 'Exercises found', results);
            } else {
                console.log(`[WARN] No exercises found matching the pattern: ${exerciseName}`);
                return this.createResponse(404, 'No exercises found matching the pattern');
            }
        } catch (error) {
            console.error(`[ERROR] Failed to fetch exercises: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to retrieve all exercises
    async getAllExercises() {
        console.log(`[INFO] Fetching all exercises`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM exercises`)
                .all();

            console.log(`[INFO] Retrieved ${results.length} exercises`);
            return this.createResponse(200, 'Exercises retrieved successfully', results);
        } catch (error) {
            console.error(`[ERROR] Failed to fetch all exercises: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to add a new exercise
    async addExercise(name, description) {
        console.log(`[INFO] Adding new exercise: ${name}`);

        if (!name || !description) {
            console.warn(`[WARN] Missing parameters: name or description`);
            return this.createResponse(400, "'name' and 'description' are required parameters");
        }

        const sql = `INSERT INTO exercises (name, description) VALUES (?, ?)`;

        try {
            const { success, lastInsertRowId } = await this.db
                .prepare(sql)
                .bind(name, description)
                .run();

            if (success) {
                console.log(`[INFO] Exercise "${name}" added successfully`);

                const response = await this.getExercisesByName(name);
                return this.createResponse(201, 'Exercise added successfully', response);
            } else {
                console.error(`[ERROR] Failed to add the exercise: ${name}`);
                return this.createResponse(500, 'Failed to add the exercise');
            }
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                console.warn(`[WARN] Conflict: Exercise with this name already exists`);
                return this.createResponse(409, 'Conflict: Exercise with this name already exists');
            }
            console.error(`[ERROR] Database error: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }
}

export default ExerciseService;