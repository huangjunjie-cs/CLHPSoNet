#!/usr/bin/env python
# coding=utf-8
__author__ = 'h12345jack'

import json

from flask import  Flask
from flask_cors import  *
from flask import request
from .partition import get_subgraph
app = Flask(__name__)
CORS(app, supports_credentials=True)

default_people = ['1384', '3762', '1493', '3767', '1762', '7364']
default_algo = '1'

algo_dict = {
}
@app.route('/api/compute', methods=['POST'])
def compute():
    """[summary]
    
    Returns:
        [type] -- [description]
    """
    if request.method =='POST':
        req = request.json
        nodes = req.get('people', default_people)
        algorithm = req.get('algorithm', default_algo)
        depth = req.get('depth', 0)
    else:
        return "Hello"


if __name__ == '__main__':
    app.run(debug=True)