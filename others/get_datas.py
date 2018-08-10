#!/usr/bin/env python
# -*- coding: utf-8 -*-


'''
get datas by query api, save to data directory
'''
import os
import json
import threading

import requests

from multiprocessing.dummy import Pool as Threadpool

lock1 = threading.Lock()

DATA_DIR = './datas/datas'
WRONG_LOG = './logs/error.log'
END_NUM = 445000
HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
}

if not os.path.exists('datas'):
    os.mkdir('datas')

if not os.path.exists('logs'):
    os.mkdir('logs')

if not os.path.exists(DATA_DIR):
    os.mkdir(DATA_DIR)


def req_page(page = 1):
    """requests api for page
    
    Keyword Arguments:
        page {int} -- [description] (default: {1})
    """
    url = 'https://cbdb.fas.harvard.edu/cbdbapi/person.php?id={}&o=json'.format(page)
    result = os.path.join(DATA_DIR, '{}.json'.format(page))
    if not os.path.exists(result):
        try:

            req = requests.get(url, headers = HEADERS)
            content = req.text
            json_data = json.loads(content)
            with open(result, 'w') as f:
                f.write(json.dumps(json_data))
        except Exception as e:
            lock1.acquire()
            with open(WRONG_LOG, 'a') as f:
                print("page:{}".format(page), e, file=f)
            print(page, e)
            lock1.release()

    
def main():
    req_page(1)
    pages = [i for i in range(1, END_NUM)]
    # req_page(4)
    pool =  Threadpool(10)
    pool.map(req_page, pages)
    pool.close()
        

if __name__ == '__main__':
    main()
