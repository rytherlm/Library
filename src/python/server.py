from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from api.book import Book
from api.bookUser import BookUser
from api.bookSearch import BookSearch
from api.userSearch import UserSearch
from api.utils import *
from api.friends import Friends



app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

api.add_resource(BookUser, '/bookuser')  
api.add_resource(Book, '/book')  
api.add_resource(BookSearch, '/booksearch')
api.add_resource(UserSearch, '/usersearch')
api.add_resource(Friends, '/friends')

if __name__ == '__main__':
    print("Loading db")
    print("Starting flask")
    app.run(debug=True,port=5002), 


