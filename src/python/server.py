from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from api.book import Book
from api.bookUser import BookUser
from api.utils import *



app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

api.add_resource(BookUser, '/bookuser')  
api.add_resource(Book, '/book')  

if __name__ == '__main__':
    print("Loading db")
    print("Starting flask")
    app.run(debug=True,port=5002), 


