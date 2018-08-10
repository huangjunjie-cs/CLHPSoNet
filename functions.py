#!/usr/bin/env python
# -*- coding=utf-8 -*-

import re
import os
import json
import heapq
import math
from collections import defaultdict

import networkx as nx
from networkx.readwrite import json_graph
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import igraph as ig
import pandas as pd
import louvain
from louvain import Optimiser
from matplotlib.font_manager import FontProperties  

from googletrans import Translator

CENTRALITY_DIR = 'centrality'
VIS_DATA_DIR = './vis_datas'

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


def get_subgraph(node_lists = ['1762'], depth = 3, graph_path='song-signed.gexf'):
    '''
    node-list 是起点节点，
    depth是深度
    '''
    gexf_path = os.path.join(VIS_DATA_DIR, graph_path)
    g = nx.read_gexf(gexf_path)
    # 
    g_edges = g.edges()
    g_edges_dict = defaultdict(set)
    for edge in g_edges:
        n1 = edge[0]
        n2 = edge[1]
        g_edges_dict[n1].add(n2)
        g_edges_dict[n2].add(n1)
    # print(len(g_edges_dict['1762']))
    subgraph_nodes = set(node_lists)
    now_nlists = list(node_lists)
    k = depth
    while k:
        k -= 1
        next_nlists = []
        for node in now_nlists:
            for n in g_edges_dict[node]:
                if n not in subgraph_nodes:
                    next_nlists.append(n)

        next_nlists = list(set(next_nlists))
        print(len(next_nlists))
        tmp = list(subgraph_nodes)
        tmp.extend(next_nlists)
        subgraph_nodes = set(tmp)
        now_nlists = next_nlists
            # 获取这个节点的所有连接节点
    print(len(subgraph_nodes))
    sub_g = g.subgraph(subgraph_nodes)
    return sub_g



def naive_plot(node_list, cate="1"):
    '''
    1384, 歐陽修 22
    3762,蘇洵 2
    1493,蘇轍 13
    3767,蘇軾 2
    1762,王安石 6
    7364,曾鞏 0    
    '''
        
    graph_path_dict = {
        '1': 'song-pos.gexf',
        '2': 'song-neg.gexf',
        '3': 'song-signed.gexf'
    }
    graph_path = graph_path_dict[cate]
    sub_g = get_subgraph(node_lists=node_list, depth=0, graph_path=graph_path)
    people_df = pd.read_csv('./csv/宋.csv')
    attrs = dict()
    centrality_attrs = dict()

    with open('./centrality/song_centrality.json') as f:
        json_data = json.load(f)
    for n in sub_g.nodes():
        p = people_df[people_df.nid == int(n)]
        name1 = p['ChName']
        name2 = p['EngName']
        attrs[n]= "".join(name1.values)

        d = dict()
        d["EngName"] = "".join(name2.values)
        d["ChName"] = "".join(name1.values)
        d["PersonID"] = n
        pku = json_data[n]
        d["c1"] = round(pku[0], 3)
        d["c2"] = round(pku[1], 3)
        d["c3"] = round(pku[2], 3)
        d["c4"] = round(pku[3], 3)
        centrality_attrs[n] = d
    G = sub_g
    e_pos = [(u, v) for (u, v, d) in G.edges(data=True) if d['weight'] > 0]
    e_neg = [(u, v) for (u, v, d) in G.edges(data=True) if d['weight'] < 0]
    pos = nx.circular_layout(G)
    # 为了保证画出来顺序是确定的，
    # print(pos.items())
    values = sorted(pos.items(), key = lambda x:x[1][1]/x[1][0], reverse=True)

    nodes = {i[0]: {'position': list(i[1]), 'name': attrs[i[0]], 'centrality': centrality_attrs[i[0]]} for i in values}
    pos_key = [i for i in pos.keys()]
    pos_key.sort()
    
    for index, i in enumerate(pos_key):
        pos[i] = values[index][1]

    for n in G:
        G.node[n]['name'] = n
    d = json_graph.node_link_data(G) # node-link format to serialize
    # print(d)
    # print(pos_values)
    return d, nodes
    # nx.draw_networkx_nodes(G, pos, node_size=10)
    # nx.draw_networkx_edges(G, pos, edgelist=e_pos,
    #                    width=1, edge_color='g',alpha=0.5)
    # nx.draw_networkx_edge_labels(G, pos,edge_labels=edge_attrs, edge_color='k')
    # nx.draw_networkx_edges(G, pos, edgelist=e_neg,
    #                    width=1, edge_labels=edge_attrs, edge_color='r', style='dashed')
    # nx.draw_networkx_labels(G, pos, labels=attrs, font_size=20, font_color='b',font_family='simhei')
    # plt.axis('off')
    # plt.show()

def layer_partition(node_lists):
    sub_g = get_subgraph(node_lists=node_lists, depth=0)
    #8175
    #sub_g = get_subgraph(node_lists = ['8175', '8008'], depth=1)
    
    graphml_path = os.path.join(VIS_DATA_DIR, 'song-tmp.graphml')
    nx.write_graphml(sub_g, graphml_path)
    G = ig.Graph.Read_GraphML(graphml_path)
    G_pos = G.subgraph_edges(G.es.select(weight_gt = 0), delete_vertices=False)
    G_neg = G.subgraph_edges(G.es.select(weight_lt = 0), delete_vertices=False)
    G_neg.es['weight'] = [-w for w in G_neg.es['weight']]
    part_pos = louvain.ModularityVertexPartition(G_pos, weights='weight')
    part_neg = louvain.ModularityVertexPartition(G_neg, weights='weight')
    optimiser = louvain.Optimiser()
    part_pos = louvain.ModularityVertexPartition(G_pos, weights='weight')
    part_neg = louvain.ModularityVertexPartition(G_neg, weights='weight')
    diff = optimiser.optimise_partition_multiplex([part_pos, part_neg],layer_weights=[1,-1])
    # while diff > 0:
    #     diff = optimiser.optimise_partition_multiplex([part_pos, part_neg],layer_weights=[1,-1])
    # print(diff)
    # print(part_neg)
    # print(part_pos)
    # for v in G.vs:
    #     print(v.index, v["label"])
    # print(dir(part_pos), part_pos.membership)
    # print(dir(part_pos))
    # print(part_pos.summary())
    # print(part_pos.modularity, part_pos.q, part_pos)
    
    node_partition = {}
    for v in G.vs:
        node_partition[v["label"]] = v.index
    node_partition2 = {}
    memberships = [i for i in part_pos.membership]
    assert len(memberships) == len(node_partition)
    for i in node_partition:
        node_partition2[i] = memberships[node_partition[i]]
        
    return node_partition2
    


def main():
    node_list = ['1384', '3762', '1493', '3767', '1762', '7364']
    # links1, nodes = naive_plot(node_list)
    # print(nodes)
    # links2, nodes = naive_plot(node_list, cate='2')
    # print(nodes)
    # links3, nodes = naive_plot(node_list, cate='3')
    # print(nodes)
    layer_partition(node_list)

if __name__ == '__main__':
    main()