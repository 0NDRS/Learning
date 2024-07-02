from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(150), nullable=False)

@app.route('/')
def index():
    return 'Server is running!'

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        password_confirm = data.get('confirmPassword')

        # Step-by-step server-side validation
        if not username or not password or not password_confirm:
            return jsonify({'error': 'All fields are required'}), 400

        password_regex = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$')
        if not password_regex.match(password):
            return jsonify({'error': 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'}), 400

        if password != password_confirm:
            return jsonify({'error': 'Passwords do not match'}), 400

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'error': 'Username already exists'}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, password=hashed_password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'success': 'Registration successful'}), 200
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user = User.query.filter_by(username=username).first()

        # Step-by-step server-side validation
        if not username or not password:
            return jsonify({'error': 'All fields are required'}), 400

        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            return jsonify({'success': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 400
    
    return render_template('login.html')

@app.route('/home')
def home():
    if 'user_id' in session:
        user = User.query.filter_by(id=session['user_id']).first()
        return render_template('home.html', user=user)
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
