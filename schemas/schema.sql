-- Drop the tables if they already exist
DROP TABLE IF EXISTS workout_logs;
DROP TABLE IF EXISTS workout_sessions;
DROP TABLE IF EXISTS exercises;

-- Create a table to store exercises
CREATE TABLE exercises (
    name VARCHAR(100) PRIMARY KEY,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the name column for faster lookups by exercise name
CREATE INDEX idx_exercises_name ON exercises(name);

-- Create a table to store workout sessions
-- Represents A Crossfit Class!!
-- TODO rename to CrossfitClass
CREATE TABLE workout_sessions (
    session_date TIMESTAMP PRIMARY KEY DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on session_date for faster querying of workout history by date
CREATE INDEX idx_workout_sessions_date ON workout_sessions(session_date);

-- Create a table to store logged sets of exercises (weight and reps)
CREATE TABLE workout_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_session_date TIMESTAMP REFERENCES workout_sessions(session_date) ON DELETE CASCADE,
    exercise_name VARCHAR(100) REFERENCES exercises(name) ON DELETE CASCADE,
    weight DECIMAL(5, 2) NOT NULL, -- Weight lifted in kg or lbs
    reps INTEGER NOT NULL, -- Number of repetitions
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices to optimize querying by workout_session_id and exercise_id
CREATE INDEX idx_workout_logs_workout_session_id ON workout_logs(workout_session_date);
CREATE INDEX idx_workout_logs_exercise_name ON workout_logs(exercise_name);