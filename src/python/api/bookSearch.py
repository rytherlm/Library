from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
from .utils import *

class BookSearch(Resource):
    def get(self):
        params = []
        for i, key in enumerate(request.args.keys()):
            value = request.args[key]
            if(key == "title"):
                sql = "SELECT * FROM book WHERE LOWER(title) LIKE %s"
                params.append(f"%{value.lower()}%")
            elif(key == "releasedate"):
                sql = "SELECT * FROM book WHERE releasedate = %s"
                params.append(value)
            elif(key == "author" or key == "publisher"):
                sql = """SELECT contributorid FROM contributor WHERE
                LOWER(CONCAT(firstname, ' ', lastname)) LIKE %s"""
                contributors = exec_get_all(sql, ((f"%{value.lower()}%"),))
                returnData = []
                for contributor in contributors:
                    if(key == "author"):
                        check = exec_get_one("SELECT contributorid FROM author WHERE contributorid = %s", (contributor[0],))
                    elif(key == "publisher"):
                        check = exec_get_one("SELECT contributorid FROM publisher WHERE contributorid = %s", (contributor[0],))
                    if(check is None):
                        continue
                    sql = "SELECT bookid FROM contribute WHERE contributorid = %s"
                    books = exec_get_all(sql, (contributor[0],))
                    for book in books:
                        sql = "SELECT * FROM book WHERE bookid = %s"
                        result = exec_get_one(sql, (book[0],))
                        returnData.append(result)
                return returnData
            elif(key == "genre"):
                sql = "SELECT genreid FROM genres WHERE LOWER(genre) LIKE %s"
                genreids = exec_get_all(sql, ((f"%{value.lower()}%"),))
                returnData = []
                for genreid in genreids:
                    sql = "SELECT bookid FROM bookgenre WHERE genreid = %s"
                    books = exec_get_all(sql, (genreid[0],))
                    for book in books:
                        sql = "SELECT * FROM book WHERE bookid = %s"
                        result = exec_get_one(sql, (book[0],))
                        returnData.append(result)
                return returnData
        result = exec_get_all(sql, params)
        return result