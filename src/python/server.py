from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from api.book import Book
from api.bookUser import BookUser
from api.bookSearch import BookSearch
from api.userSearch import UserSearch
from api.utils import *
from api.friends import Friends
from api.author import Author
from api.rating import BookRatings
from api.track import Track
from api.section import Section
from api.collection import Collection
from api.collectionSearch import CollectionSearch
from api.stores import Stores


app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

api.add_resource(BookUser, '/bookuser')  
api.add_resource(Book, '/book')  
api.add_resource(BookSearch, '/booksearch')
api.add_resource(UserSearch, '/usersearch')
api.add_resource(Friends, '/friends')
api.add_resource(Author, '/author')
api.add_resource(BookRatings, '/rating')
api.add_resource(Track,'/track')
api.add_resource(Section,'/section')
api.add_resource(Collection, '/collection')
api.add_resource(CollectionSearch, '/collectionsearch')
api.add_resource(Stores, '/stores')

if __name__ == '__main__':
    print("Loading db")
    print("Starting flask")
    app.run(debug=True,port=5002), 


