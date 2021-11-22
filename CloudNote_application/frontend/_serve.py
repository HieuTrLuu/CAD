from flask import Flask, render_template
app = Flask(__name__, static_folder="build/static", template_folder="build")
# @app.route("/")
# def hello():
#     return render_template('index.html')
# print('Starting Flask!')
# app.debug=True
# app.run(host='0.0.0.0')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # return 'You want path: %s' % path
    return render_template('index.html')

if __name__ == '__main__':
    app.run()