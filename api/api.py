import os
from flask import Flask, flash, request, redirect, url_for, session
import flask_sqlalchemy
import flask_praetorian
import flask_cors
from werkzeug.utils import secure_filename

db = flask_sqlalchemy.SQLAlchemy()
guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()


# A generic user model that might be used by an app powered by flask-praetorian
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True)
    password = db.Column(db.Text)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='true')


    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active

UPLOAD_FOLDER = './static/'
ALLOWED_EXTENSIONS = set([ 'png', 'jpg', 'jpeg', 'gif'])


# Initialize flask app for the example
app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'This is secret'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 1}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 5}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the flask-praetorian instance for the app
guard.init_app(app, User)

# Initialize a local database for the example
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///database.db"
db.init_app(app)

# Initializes CORS so that the api_tool can talk to the example app
cors.init_app(app)

# Add users for the example
with app.app_context():
    db.create_all()
    if db.session.query(User).filter_by(username='Utkarsh').count() < 1:
        db.session.add(User(
          username='Utkarsh',
          roles='admin',
          password=guard.hash_password('utpassword'),
            ))
    db.session.commit()


# Set up some routes for the example
@app.route('/api/')
def home():
    return {"Hello": "World"}, 200


@app.route('/api/login', methods=['POST'])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    """
    req = request.get_json(force=True)
    username = req.get('username', None)
    password = req.get('password', None)
    user = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(user)}
    return ret, 200

  
@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    """
    print("refresh request")
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200
  
@app.route('/api/upload', methods=['POST'])
@flask_praetorian.auth_required
def upload():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    """
    target=os.path.join(UPLOAD_FOLDER,'img')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    response ={'filename': filename }
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0")
