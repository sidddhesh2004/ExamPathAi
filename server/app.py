import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, JWTManager

# --- 1. INITIALIZATIONS AND CONFIGURATIONS ---

# Load environment variables from the .env file
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)

# Configure secret keys and extensions
# IMPORTANT: Change this secret key for a real production application!
app.config["JWT_SECRET_KEY"] = "a-long-random-super-secret-key"
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)


# --- 2. HELPER FUNCTIONS ---

# A reusable function to get a database connection
def get_db_connection():
    """Establishes a connection to the PostgreSQL database."""
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    return conn


# --- 3. API ROUTES ---

# -- User Authentication Routes --

@app.route('/api/register', methods=['POST'])
def register_user():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s;", (username,))
    user_exists = cur.fetchone()

    if user_exists:
        cur.close()
        conn.close()
        return jsonify({"msg": "Username already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    cur.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s);", (username, hashed_password))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"msg": "User created successfully"}), 201


@app.route('/api/login', methods=['POST'])
def login_user():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, password_hash FROM users WHERE username = %s;", (username,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user and bcrypt.check_password_hash(user[2], password): # user[2] is the password_hash
        access_token = create_access_token(identity=user[0]) # user[0] is the user id
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401

# -- Quiz & Career Routes --

@app.route('/api/quiz')
def get_quiz():
    """Fetches all quiz questions from the database."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, text, riasec_type FROM questions ORDER BY id;')
    db_questions = cur.fetchall()
    cur.close()
    conn.close()
    
    questions_list = [{"id": q[0], "text": q[1], "type": q[2]} for q in db_questions]
    return jsonify(questions_list)

@app.route('/api/careers/<riasec_type>')
def get_careers_by_type(riasec_type):
    """Fetches career recommendations based on a RIASEC type."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT job_title, description FROM careers WHERE primary_riasec_type = %s;', (riasec_type,))
    db_careers = cur.fetchall()
    cur.close()
    conn.close()

    careers_list = [{"title": career[0], "description": career[1]} for career in db_careers]
    return jsonify(careers_list)

# -- Exam Guidance Routes --

@app.route('/api/exams')
def get_all_exams():
    """Fetches a list of all exams."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, exam_name, full_name FROM exams ORDER BY exam_name;')
    db_exams = cur.fetchall()
    cur.close()
    conn.close()

    exams_list = [{"id": exam[0], "name": exam[1], "fullName": exam[2]} for exam in db_exams]
    return jsonify(exams_list)

@app.route('/api/exams/<int:exam_id>')
def get_exam_details(exam_id):
    """Fetches detailed information and syllabus for a specific exam."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT exam_name, full_name, description FROM exams WHERE id = %s;', (exam_id,))
    exam_info = cur.fetchone()

    if not exam_info:
        cur.close()
        conn.close()
        return jsonify({"error": "Exam not found"}), 404

    cur.execute('SELECT section_name, syllabus_details FROM exam_sections WHERE exam_id = %s;', (exam_id,))
    exam_sections = cur.fetchall()
    cur.close()
    conn.close()

    exam_details = {
        "name": exam_info[0],
        "fullName": exam_info[1],
        "description": exam_info[2],
        "sections": [{"name": section[0], "syllabus": section[1]} for section in exam_sections]
    }
    return jsonify(exam_details)


# --- 4. MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5001))
  app.run(debug=True, host='0.0.0.0', port=port)