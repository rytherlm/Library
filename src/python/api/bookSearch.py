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
                sql = """SELECT book.*, 
                STRING_AGG(DISTINCT COALESCE(contributor.firstname, '') || ' ' || COALESCE(contributor.lastname, ''), ', '),
                STRING_AGG(DISTINCT COALESCE(genres.genre, ''), ', ')
                FROM book, contributor, contribute, genres, bookgenre
                WHERE LOWER(title) LIKE %s
                AND book.bookid = contribute.bookid
                AND contribute.contributorid = contributor.contributorid
                AND bookgenre.bookid = book.bookid
                AND bookgenre.genreid = genres.genreid
                GROUP BY book.bookid
                ORDER BY book.title ASC, book.releasedate ASC
                """
                params.append(f"%{value.lower()}%")
            elif(key == "releasedate"):
                sql = """SELECT book.*, 
                STRING_AGG(DISTINCT COALESCE(contributor.firstname, '') || ' ' || COALESCE(contributor.lastname, ''), ', '),
                STRING_AGG(DISTINCT COALESCE(genres.genre, ''), ', ')
                FROM book, contributor, contribute, genres, bookgenre
                WHERE releasedate = %s
                AND book.bookid = contribute.bookid
                AND contribute.contributorid = contributor.contributorid
                AND bookgenre.bookid = book.bookid
                AND bookgenre.genreid = genres.genreid
                GROUP BY book.bookid
                ORDER BY book.title ASC, book.releasedate ASC"""
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
                        sql = """SELECT book.*, 
                        STRING_AGG(DISTINCT COALESCE(contributor.firstname, '') || ' ' || COALESCE(contributor.lastname, ''), ', '),
                        STRING_AGG(DISTINCT COALESCE(genres.genre, ''), ', ')
                        FROM book, contributor, contribute, genres, bookgenre
                        WHERE book.bookid = %s
                        AND book.bookid = contribute.bookid
                        AND contribute.contributorid = contributor.contributorid
                        AND bookgenre.bookid = book.bookid
                        AND bookgenre.genreid = genres.genreid
                        GROUP BY book.bookid
                        ORDER BY book.title ASC, book.releasedate ASC
                        """
                        result = exec_get_one(sql, (book[0],))
                        if(result is not None):
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
                        sql = """SELECT book.*, 
                        STRING_AGG(DISTINCT COALESCE(contributor.firstname, '') || ' ' || COALESCE(contributor.lastname, ''), ', '),
                        STRING_AGG(DISTINCT COALESCE(genres.genre, ''), ', ')
                        FROM book, contributor, contribute, genres, bookgenre
                        WHERE book.bookid = %s
                        AND book.bookid = contribute.bookid
                        AND contribute.contributorid = contributor.contributorid
                        AND bookgenre.bookid = book.bookid
                        AND bookgenre.genreid = genres.genreid
                        GROUP BY book.bookid
                        ORDER BY book.title ASC, book.releasedate ASC"""
                        result = exec_get_one(sql, (book[0],))
                        if(result is not None):
                            returnData.append(result)
                return returnData
        result = exec_get_all(sql, params)
        print(result)
        return result