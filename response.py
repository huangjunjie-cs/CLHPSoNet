#!/usr/bin/env python
# coding=utf-8
__author__ = 'h12345jack'

import json
import os
import lxml
import lxml.html as html
import requests

from flask import  Flask
from flask_cors import  *
from flask import request, jsonify
from partition import get_subgraph
app = Flask(__name__)
CORS(app, supports_credentials=True)

DATA_DIR = './datas/datas'

default_people = ['1384', '3762', '1493', '3767', '1762', '7364']
default_algo = '1'

algo_dict = {
}

def get_node_lists(node_list):
    results = [
        ['3762', [-0.49999989, -0.86602541]], 
        ['1762', [0.49999998, 0.86602546]], 
        ['7364', [-9.99999970e-01, -6.29182054e-08]], 
        ['1493', [1.00000000e+00, 2.45045699e-08]], 
        ['3767', [-0.50000004,  0.8660254 ]], 
        ['1384', [ 0.49999992, -0.86602541]]
    ]
    return results

def get_links(cate=1, node_list):
    pass



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


# @app.route('/api/node_lists', methods=['GET'])
# def get_node_lists():
#     return jsonify()


def get_xy_relationship(x, y):
    fpath = os.path.join(DATA_DIR, x + '.json')
    with open(fpath) as f:
        person = json.load(f)
    results = []
    person_data = person['Package']['PersonAuthority']['PersonInfo']['Person']
    x_name = person_data['BasicInfo']['ChName']
    person_association = person_data["PersonSocialAssociation"]
    if 'Association' in person_association:
        person_assoc = person_association['Association']
        if isinstance(person_assoc, list):
            for person in person_association['Association']:
                if 'AssocPersonId' in person and person['AssocPersonId'] == y:
                    person['X'] = x
                    person['Y'] = y
                    results.append(person)
        elif isinstance(person_assoc, dict):
            if 'AssocPersonId' in person and person['AssocPersonId'] == y:
                    person['X'] = x
                    person['Y'] = y
                    results.append(person)
    return x_name, results


@app.route('/api/getXY_relationship', methods=['POST'])
def getXY_relationship():
    if request.method == "POST":
        req = request.json
        x_id = req.get('x', '1762')
        y_id = req.get('y', '1762')
        results = []
        x, pku = get_xy_relationship(x_id, y_id)
        results.extend(pku)
        y, pku = get_xy_relationship(y_id, x_id)
        results.extend(pku)
        return jsonify({
            'relations': results,
            'x_name': x,
            'y_name': y
        })



HEADERS = {
    "Accept": "text/javascript, text/html, application/xml, text/xml, */*",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
}

def get_profile_img(name='王安石'):
    proxies = {
        'http': 'http://127.0.0.1:1087',
        'https': 'http://127.0.0.1:1087',
    }

    url = 'https://zh.wikipedia.org/wiki/{}'.format(name)
    print(url, 63)
    res = requests.get(url, headers=HEADERS, proxies=proxies)
    etree = html.fromstring(res.content)
    imgs = etree.xpath('//img/@src')
    imgs = [str(i) for i in imgs if i.find('svg') == -1 and i.find('upload.wikimedia') > -1]
    imgs = list(map(lambda x: 'http:'+x if not x.startswith('http:') else x, imgs))
    if len(imgs) > 0:
        return imgs[0]
    else:
        return ''


@app.route('/api/get_profile', methods=['POST'])
def get_profile():
    if request.method == "POST":
        req = request.json
        node_id = req.get('node_id', '1762')
        print(node_id)
        fpath = os.path.join(DATA_DIR, node_id + '.json')
        with open(fpath) as f:
            person = json.load(f)
        person_data = person['Package']['PersonAuthority']['PersonInfo']['Person']
        basic_info = person_data['BasicInfo']
        tags = [i['StatusName'] for i in person_data['PersonSocialStatus']['SocialStatus']]
        name = basic_info['ChName']
        img = get_profile_img(name)
        return jsonify({
            'profile_url': img,
            'basic_info': basic_info,
            'tags': tags
        })


if __name__ == '__main__':
    app.run(debug=True)
    # get_profile_img()