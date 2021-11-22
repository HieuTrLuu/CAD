# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import datetime
import logging
import os

from flask import Flask, render_template, request, Response, abort, jsonify, send_from_directory
from flask_cors import CORS
import sqlalchemy


# Remember - storing secrets in plaintext is potentially unsafe. Consider using
# something like https://cloud.google.com/kms/ to help keep secrets secret.
db_user = "sam"
db_pass = "pass"
db_name = "cloudnote_db"
cloud_sql_connection_name = "cloudnote-257610:europe-west1:cloudnote-mysql-db"

app = Flask(__name__, static_folder="build", template_folder="build")
CORS(app)

logger = logging.getLogger()

# [START cloud_sql_mysql_sqlalchemy_create]
# The SQLAlchemy engine will help manage interactions, including automatically
# managing a pool of connections to your database
db = sqlalchemy.create_engine(
    # Equivalent URL:
    # mysql+pymysql://<db_user>:<db_pass>@/<db_name>?unix_socket=/cloudsql/<cloud_sql_instance_name>
    sqlalchemy.engine.url.URL(
        drivername="mysql+pymysql",
        username=db_user,
        password=db_pass,
        database=db_name,
        query={"unix_socket": "/cloudsql/{}".format(cloud_sql_connection_name)},
    ),
    # ... Specify additional properties here.
    # [START_EXCLUDE]
    # [START cloud_sql_mysql_sqlalchemy_limit]
    # Pool size is the maximum number of permanent connections to keep.
    pool_size=5,
    # Temporarily exceeds the set pool_size if no connections are available.
    max_overflow=2,
    # The total number of concurrent connections for your application will be
    # a total of pool_size and max_overflow.
    # [END cloud_sql_mysql_sqlalchemy_limit]
    # [START cloud_sql_mysql_sqlalchemy_backoff]
    # SQLAlchemy automatically uses delays between failed connection attempts,
    # but provides no arguments for configuration.
    # [END cloud_sql_mysql_sqlalchemy_backoff]
    # [START cloud_sql_mysql_sqlalchemy_timeout]
    # 'pool_timeout' is the maximum number of seconds to wait when retrieving a
    # new connection from the pool. After the specified amount of time, an
    # exception will be thrown.
    pool_timeout=30,  # 30 seconds
    # [END cloud_sql_mysql_sqlalchemy_timeout]
    # [START cloud_sql_mysql_sqlalchemy_lifetime]
    # 'pool_recycle' is the maximum number of seconds a connection can persist.
    # Connections that live longer than the specified amount of time will be
    # reestablished
    pool_recycle=1800,  # 30 minutes
    # [END cloud_sql_mysql_sqlalchemy_lifetime]
    # [END_EXCLUDE]
)


# [END cloud_sql_mysql_sqlalchemy_create]


@app.before_first_request
def create_tables():
    # Create tables (if they don't already exist)
    with db.connect() as connection:
#         connection.execute(
#           "DROP TABLE IF EXISTS Tags"
#         )
#         connection.execute(
#            "DROP TABLE IF EXISTS Changes"
#         )
#         connection.execute(
#            "DROP TABLE IF EXISTS Contributors;"
#         )
#         connection.execute(
#            "DROP TABLE IF EXISTS Page"
#         )
#         connection.execute(
#            "DROP TABLE IF EXISTS Notebook"
#         )
#         connection.execute(
#           "DROP TABLE IF EXISTS Users"
#         )

        connection.execute(
            "CREATE TABLE IF NOT EXISTS Users ("
            "  user_id INT AUTO_INCREMENT NOT NULL,"
            "  username VARCHAR(255),"
            "  firstname VARCHAR(255),"
            "  lastname VARCHAR(255),"
            "  university VARCHAR(255),"
            "  uni_email VARCHAR(255),"
            "  pass VARCHAR(255),"
            "  notebook_id INT,"
            "  PRIMARY KEY (user_id)"
            ");"
        )
        connection.execute(
            "CREATE TABLE IF NOT EXISTS Notebook ("
            "  notebook_id VARCHAR(255) NOT NULL,"
            "  owner_id INT NOT NULL,"
            "  title VARCHAR(255) NOT NULL,"
            "  module_code VARCHAR(16) NOT NULL,"
            "  PRIMARY KEY (notebook_id),"
            "  FOREIGN KEY (owner_id) REFERENCES Users (user_id)"
            ");"
        )
        connection.execute(
            "CREATE TABLE IF NOT EXISTS Page ("
            "  page_id VARCHAR(255) NOT NULL,"
            "  owner_id INT NOT NULL,"
            "  owner_email VARCHAR(255) NOT NULL,"
            "  title VARCHAR(255),"
            "  content VARCHAR(255)," #This is a pointer to the location of the content in firebase
            "  PRIMARY KEY (page_id),"
            "  FOREIGN KEY (owner_id) REFERENCES Users (user_id)"
            ");"
        )
        connection.execute(
            "CREATE TABLE IF NOT EXISTS Tags ("
            "  page_id VARCHAR(255) NOT NULL,"
            "  tag VARCHAR(255),"
            "  FOREIGN KEY (page_id) REFERENCES Page (page_id)"
            ");"
        )
        connection.execute(
            "CREATE TABLE IF NOT EXISTS Changes ("
            "  change_id INT NOT NULL AUTO_INCREMENT,"
            "  page_id VARCHAR(255) NOT NULL,"
            "  author_id INT NOT NULL,"
            "  newBody MEDIUMTEXT,"
            "  time VARCHAR(255),"
            "  PRIMARY KEY (change_id),"
            "  FOREIGN KEY (page_id) REFERENCES Page (page_id),"
            "  FOREIGN KEY (author_id) REFERENCES Users (user_id)"
            ");"
        )
        connection.execute(
            "CREATE TABLE IF NOT EXISTS Contributors ("
            "  con_id VARCHAR(255) NOT NULL,"
            "  page_id VARCHAR(255) NOT NULL,"
            "  user_id INT NOT NULL,"
            "  PRIMARY KEY (con_id),"
            "  FOREIGN KEY (page_id) REFERENCES Page (page_id),"
            "  FOREIGN KEY (user_id) REFERENCES Users (user_id)"
            ");"
        )



@app.route("/api/contributors/", methods=["GET"])
def getContributors():
    with db.connect() as connection:
        if not 'page_id' in request.values:
            abort(400)

        pageID = request.values['page_id']
        queryRes = connection.execute(
            "SELECT u.user_id, u.username, u.uni_email "
            "FROM Contributors AS c LEFT JOIN Users AS u on c.user_id=u.user_id "
            "WHERE c.page_id=\'%s\';" % pageID
        )
        return jsonify({"contributors": [dict(row) for row in queryRes]})


@app.route("/api/contributors/add", methods=["GET", "POST"])
def addContributor():
    with db.connect() as connection:
#         return jsonify({"values": str(request.values)})
        if not 'page_id' in request.values or not 'contributor_email' in request.values:
            abort(400)

        contEmail = request.values['contributor_email']
        idQuery = connection.execute(
            "SELECT user_id "
            "FROM Users "
            "WHERE uni_email=\'%s\';" % contEmail
        )

        res = idQuery.first()
        if res is None:
            abort(412, "That user does not exist")

        contID = res['user_id']
        pageID = request.values['page_id']
        conID = str(pageID)+str(contID)

        primaryCheck = connection.execute(
            "SELECT * FROM Contributors WHERE con_id=\'%s\'" % conID
        )

        if primaryCheck.first() is not None:
            abort(409, "That relationship already exists")

        connection.execute(
            "INSERT INTO Contributors (con_id, page_id, user_id) "
            "VALUES (\'%s\', \'%s\', %s);" % (conID, pageID, contID)
        )
        return "Contributor successfully added"

@app.route("/api/contributors/remove", methods=["GET", "DELETE"])
def removeContributor():
    with db.connect() as connection:
        if not 'page_id' in request.values or not 'user_id' in request.values:
            abort(400)

        pageID = request.values['page_id']
        userID = request.values['user_id']

        connection.execute(
            "DELETE FROM Contributors "
            "WHERE page_id=\'%s\' AND user_id=\'%s\';" % (pageID, userID)
        )
        return "Successfully removed contributor"

@app.route("/api/changes/get", methods=["GET", "POST"])
def getChanges():
    with db.connect() as connection:
        if not 'page_id' in request.values:
            abort(400)
        pageID = request.values['page_id']
        queryResult = connection.execute(
            "SELECT c.change_id, c.page_id, c.author_id, c.newBody, c.time, u.username, u.uni_email "
            "FROM Changes AS c "
            "LEFT JOIN Users AS u ON c.author_id = u.user_id "
            "WHERE page_id=\'%s\';" % pageID
        )
        return jsonify({'changes': [dict(row) for row in queryResult]})


@app.route("/api/changes/propose", methods=["GET", "POST"])
def proposeChange():
    with db.connect() as connection:
        if not 'page_id' in request.json or not 'author_id' in request.json or not 'body' in request.json:
            abort(400)
        pageID = request.json['page_id']
        authorID = request.json['author_id']
        body = request.json['body']
        time = request.json['time']
        queryResult = connection.execute(
            "INSERT INTO Changes (page_id, author_id, newBody, time) "
            "VALUES (\'%s\', %s, \'%s\', \'%s\');" % (pageID, authorID, body, time)
        )
        return "Change successfully proposed"


@app.route("/api/changes/accept", methods=["GET", "POST"])
def acceptChange():
    with db.connect() as connection:
        if not 'change_id' in request.values:
            abort(400)
        changeID = request.values['change_id']
        connection.execute(
            "DELETE FROM Changes "
            "WHERE change_id = \'%s\';" % changeID
        )
        return f"Page {changeID} successfully updated"


@app.route("/api/changes/reject", methods=["GET", "POST"])
def rejectChange():
    with db.connect() as connection:
        if not 'change_id' in request.values:
            abort(400)
        changeID = request.values['change_id']
        connection.execute(
            "DELETE FROM Changes "
            "WHERE page_id = \'%s\';" % changeID
        )
        return f"Change {changeID} successfully rejected"


@app.route("/api/addUser", methods=["GET", "POST"])
def addUser():
    with db.connect() as connection:
        if not 'email' in request.json or not 'pass' in request.json:
            abort(400)
        usrEmail = request.json['email']
        usrPass = request.json['pass']

        existsCheck = connection.execute(
            "SELECT * "
            "FROM Users "
            "WHERE uni_email=\'%s\';" % usrEmail
        )
        if existsCheck.first() is not None:
            abort(412, "Email already used")

        connection.execute(
            "INSERT INTO Users (uni_email, pass) "
            "VALUES (\'%s\', \'%s\'); " % (usrEmail, usrPass)
        )
        newUserID = connection.execute(
            "SELECT user_id "
            "FROM Users "
            "WHERE uni_email=\'%s\'" % usrEmail
        )
        return f"user_id={newUserID.fetchone()['user_id']}"


@app.route("/api/getAllUsers", methods=["GET"])
def getAllUsers():
    with db.connect() as connection:
        result = connection.execute(
            "SELECT * FROM Users;"
        )
    return jsonify({'result': [dict(row) for row in result]})


@app.route("/api/signIn", methods=["GET", "POST"])
def signIn():
    with db.connect() as connection:
        if not 'email' in request.json or not 'pass' in request.json:
            abort(400)
        usrEmail = request.json['email']
        usrPass = request.json['pass']
        result = connection.execute(
            "SELECT user_id FROM Users "
            "WHERE uni_email=\"%s\" "
            "AND pass=\"%s\";" % (usrEmail, usrPass)
        )

        return f"user_id={result.first()['user_id']}"


@app.route("/api/getAllPages", methods=["GET"])
def getAllPages():
    with db.connect() as connection:
        result = connection.execute(
            "SELECT * FROM Page;"
        )
    return jsonify({'result': [dict(row) for row in result]})


@app.route("/api/getUserPages", methods=["GET", "POST"])
def getUserPages():
    with db.connect() as connection:
        if not 'owner_id' in request.values:
            abort(400)
        owner_id = request.values['owner_id']
        result = connection.execute(
            "SELECT * FROM Page "
            "WHERE owner_id=\"%s\";" % (owner_id)
        )
        return jsonify({'result': [dict(row) for row in result]})


@app.route("/api/deletePage", methods=["GET", "POST"])
def deletePage():
    with db.connect() as connection:
        if not 'owner_id' in request.json or not 'page_id' in request.json:
            abort(400)
        owner_id = request.json['owner_id']
        page_id = request.json['page_id']
        result = connection.execute(
            "DELETE FROM Page "
            "WHERE owner_id=\"%s\" "
            "AND page_id=\"%s\";" % (owner_id, page_id)
        )
        return "Success"


@app.route("/api/updateNoteTitle", methods=["GET", "POST"])
def updateNoteTitle():
    with db.connect() as connection:
        if not 'owner_id' in request.json or not 'page_id' in request.json or not 'title' in request.json:
            abort(400)
        owner_id = request.json['owner_id']
        page_id = request.json['page_id']
        title = request.json['title']
        result = connection.execute(
            "UPDATE Page "
            "SET title=\"%s\" "
            "WHERE owner_id=\"%s\" "
            "AND page_id=\"%s\";" % (title, owner_id, page_id)
        )
        return "Success"


@app.route("/api/updateNoteContent", methods=["GET", "POST"])
def updateNoteContent():
    with db.connect() as connection:
        if not 'owner_id' in request.json or not 'page_id' in request.json or not 'content' in request.json:
            abort(400)
        owner_id = request.json['owner_id']
        page_id = request.json['page_id']
        content = request.json['content']
        result = connection.execute(
            "UPDATE Page "
            "SET content=\"%s\" "
            "WHERE owner_id=\"%s\" "
            "AND page_id=\"%s\";" % (content, owner_id, page_id)
        )
        # return jsonify({'result': [dict(row) for row in result]})
        return "success"

@app.route("/api/createPage", methods=["GET", "POST"])
def createPage():
    with db.connect() as connection:
        if not 'page_id' in request.json or not 'owner_id' in request.json or not 'title' in request.json:
            abort(400)
        page_id = request.json['page_id']
        owner_id = request.json['owner_id']
        owner_email = request.json['owner_email']
        title = request.json['title']

        result = connection.execute(
            "INSERT INTO Page (page_id, owner_id, owner_email, title, content) "
            "VALUES (\"%s\", %s, \"%s\", \"%s\", \"\");" % (page_id, owner_id, owner_email, title)
        )
        return "Success"


@app.route("/api/createNotebook", methods=["GET", "POST"])
def createNotebook():
    with db.connect() as connection:
        if not 'notebook_id' in request.values or not 'owner_id' in request.values or not 'title' in request.values or not 'module_code' in request.values:
            abort(400)
        notebook_id = request.values['notebook_id']
        owner_id = request.values['owner_id']
        title = request.values['title']
        result = connection.execute(
            "INSERT INTO Notebook (owner_id, title, module_code) "
            "VALUES (%s, \"%s\", \"\");" % (owner_id, title)
        )
        return "Success"


@app.route("/api/tagPage", methods=["GET", "POST"])
def tagPage():
    with db.connect() as connection:
        if not 'page_id' in request.values or not 'tag' in request.values:
            abort(400)
        page_id = request.values['page_id']
        addTag = request.values['tag']
        result = connection.execute(
            "SELECT * FROM Tags "
            "WHERE page_id=\"%s\" "
            "AND tag=\"%s\";" % (page_id, addTag)
        )
        if result.rowcount == 0:
            connection.execute(
                "INSERT INTO Tags (page_id, tag) "
                "VALUES (\"%s\", \"%s\");" % (page_id, addTag)
            )
            return "Tag ", addTag ," has been added to note page"
        else:
            return "Tag was already assigned"

        
        


@app.route("/api/untagPage", methods=["GET", "POST"])
def untagPage():
    with db.connect() as connection:
        if not 'page_id' in request.values or not 'tag' in request.values:
            abort(400)
        page_id = request.values['page_id']
        removeTag = request.values['tag']
        connection.execute(
            "DELETE FROM Tags "
            "WHERE page_id=\"%s\" "
            "AND tag-\"%s\";" % (page_id, removeTag)
        )
        return "Tag has been removed from page, Tag: " + removeTag


@app.route("/api/removeAllTagsFromPage", methods=["GET", "POST"])
def removeAllTagsFromPage():
    with db.connect() as connection:
        if not 'page_id' in request.values:
            abort(400)
        page_id = request.values['page_id']
        connection.execute(
            "DELETE FROM Tags "
            "WHERE page_id=\"%s\";" % (page_id)
        )
        return "All tags removed from page"


@app.route("/api/removeTagFromAllPages", methods=["GET", "POST"])
def removeTagFromAllPages():
    with db.connect() as connection:
        if not 'tag' in request.values:
            abort(400)
        removeTag = request.values['tag']
        connection.execute(
            "DELETE FROM Tags "
            "WHERE tag=\"%s\";" % (removeTag)
        )
        return "Tag removed from all pages"


@app.route("/api/getPagesByTag", methods=["GET", "POST"])
def getPagesByTag():
    with db.connect() as connection:
        if not 'tag' in request.values:
            abort(400)
        retrievalTag = request.values['tag']
        result = connection.execute(
            "SELECT page_id FROM Tags "
            "WHERE tag=\"%s\";" % (retrievalTag)
        )
        return jsonify({'result': [dict(row) for row in result]})


@app.route("/api/getNotebook", methods=["GET", "POST"])
def getNotebook():
    with db.connect() as connection:
        if not 'tag' in request.values:
            abort(400)
        retrievalTags = request.values['tag']
        result = connection.execute(
            "SELECT * FROM Notebook "
            "WHERE notebook_id IN \"%s\";" % (retrievalTags)
        )
        return jsonify({'result': [dict(row) for row in result]})


@app.route("/api/retrieveCompleteNotebook", methods=["GET", "POST"])
def retrieveCompleteNotebook():
    with db.connect() as connection:
        if not 'tag' in request.values:
            abort(400)
        retreiveNoteBook = request.values["notebook_id"]
        result = connection.execute(
            "SELECT * FROM Page "
            "WHERE notebook_id = \"%s\";" % (retreiveNoteBook)
        )
        return jsonify({'result': [dict(row) for row in result]})

@app.route("/api/getUserById", methods=["GET","POST"])
def getUserById():
    with db.connect() as connection:
        if not 'user_id' in request.json:
            abort(400)
        user_id = request.json['user_id']
        result = connection.execute(
            "SELECT * FROM Users"
            " WHERE user_id=\"%s\"" % (user_id)
        )
        return jsonify({'result': [dict(row) for row in result]})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(host="localhost", use_reloader=True, port=8080, debug=True)
