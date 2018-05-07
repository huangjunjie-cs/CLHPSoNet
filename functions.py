#!/usr/bin/env python
# -*- coding=utf-8 -*-

import re
import os
import json
import heapq

from googletrans import Translator

CENTRALITY_DIR = 'centrality'


def check_contain_chinese(text):
    """check if need to translated
    
    Arguments:
        text {string} -- string to be detected
    
    Returns:
        Boolean -- whether or not contain chinese
    """
    if not text.strip(): return False
    return not all('0' <= char <= '9' for char in text)

def translate_json(input_data):
    """using google trans api to translate datas
    
    Arguments:
        input_data {[json, str]}
    
    Returns:
        input_data_translated 
    """
    if isinstance(input_data, list):
        datas = []
        for item in input_data:
            datas.append(translate_json(item))
        return datas
    elif isinstance(input_data, dict):
        data = dict()
        for item in input_data:
            data[item] = translate_json(input_data[item])
        return data
    elif isinstance(input_data, str) and check_contain_chinese(input_data):
        trans = Translator(service_urls = ['translate.google.cn'])
        trans_str = trans.translate(input_data, dest='en').text
        print(input_data, trans_str)
        return trans_str
    else:
        return input_data


def get_topPeople(dynasty = 'song', topk = 10, sort_by = 0):
    """get Topk central figures
    
    Keyword Arguments:
        dynasty {str} -- dyansty name (default: {'song'})
        topk {int} -- topk (default: {10})
        sort_by {int} -- sorted by which centrality (default: {0})
        degree_centrality, betweenness_centrality,closeness_centrality,eigenvector_centrality
    Returns:
        [type] -- topk results
    """
    json_file_path = os.path.join(CENTRALITY_DIR, '{}_centrality.json'.format(dynasty))
    with open(json_file_path) as f:
        json_data = json.load(f)
        top_degree = []
        for people in json_data:
            heapq.heappush(top_degree, (json_data[people][sort_by], json_data[people], people))
        res =  heapq.nlargest(topk, top_degree)
        return [i[1] for i in res]


def main():
    pass

if __name__ == '__main__':
    main()