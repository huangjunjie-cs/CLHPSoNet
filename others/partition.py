#coding=utf8
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

VIS_DATA_DIR = './vis_datas'


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

def parition_igraph():
    gexf_path = os.path.join(VIS_DATA_DIR, 'song-signed.gexf')
    origin_gexf_g = nx.read_gexf(gexf_path)
    # pajek_path = os.path.join(VIS_DATA_DIR, 'song-signed.net')
    # nx.write_pajek(origin_gexf_g, pajek_path)
    graphml_path = os.path.join(VIS_DATA_DIR, 'song-signed.graphml')
    nx.write_graphml(origin_gexf_g, graphml_path)
    G = ig.Graph.Read_GraphML(graphml_path)
    partition = louvain.find_partition(G, louvain.ModularityVertexPartition)
    print(partition)

def naive_plot():
    '''
    1384, 歐陽修 22
    3762,蘇洵 2
    1493,蘇轍 13
    3767,蘇軾 2
    1762,王安石 6
    7364,曾鞏 0    
    '''
    gaints = ['1384', '3762', '1493', '3767', '1762', '7364']
    # gaints = ['8175', '8008']

    sub_g = get_subgraph(node_lists=gaints, depth=0, graph_path='song-pos.gexf')
    people_df = pd.read_csv('./csv/宋.csv')
    attrs = dict()
    edge_attrs = dict()
    for n in sub_g.nodes():
        # attrs[n] = people_df[people_df.nid == int(n)].to_dict()
        # n['name'] = 'name'
        name = people_df[people_df.nid == int(n)]['ChName']
        print(name)
        attrs[n]= name.values[0]
    for u, v, d in sub_g.edges(data=True):
        if d['weight'] != 0:
            edge_attrs[(u, v)] = d['weight']
    print(attrs, 96)
    G = sub_g
    e_pos = [(u, v) for (u, v, d) in G.edges(data=True) if d['weight'] > 0]
    e_neg = [(u, v) for (u, v, d) in G.edges(data=True) if d['weight'] < 0]
    pos = nx.circular_layout(G)
    print(pos)
    # 为了保证画出来顺序是确定的，
    # print(pos.items())
    values = sorted(pos.items(), key = lambda x:x[1][1]/x[1][0], reverse=True)
    print(values)
    pos_key = [i for i in pos.keys()]
    pos_key.sort()
    
    for index, i in enumerate(pos_key):
        pos[i] = values[index][1]

    for n in G:
        G.node[n]['name'] = n
    d = json_graph.node_link_data(G) # node-link format to serialize
    # write json
    # json.dump(d, open('force/force.json','w'))
    nx.draw_networkx_nodes(G, pos, node_size=10)
    nx.draw_networkx_edges(G, pos, edgelist=e_pos,
                       width=1, edge_color='g',alpha=0.5)
    nx.draw_networkx_edge_labels(G, pos,edge_labels=edge_attrs, edge_color='k')
    nx.draw_networkx_edges(G, pos, edgelist=e_neg,
                       width=1, edge_labels=edge_attrs, edge_color='r', style='dashed')
    nx.draw_networkx_labels(G, pos, labels=attrs, font_size=20, font_color='b',font_family='simhei')
    plt.axis('off')
    plt.show()

def layer_partition():
    sub_g = get_subgraph(node_lists = ['1384', '3762', '1493', '3767', '1762', '7364'], depth=0)
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
    print(dir(part_pos))
    print(part_pos.summary())
    print(part_pos.modularity, part_pos.q, part_pos)
    
    node_partition = {}
    for v in G.vs:
        node_partition[v["label"]] = v.index
    node_partition2 = {}
    memberships = [i for i in part_pos.membership]
    assert len(memberships) == len(node_partition)
    for i in node_partition:
        # if node_partition[i] == 0:
        #     print(i)
        node_partition2[i] = memberships[node_partition[i]]
    # print(node_partition2)
    gaints = ['1384', '3762', '1493', '3767', '1762', '7364']
    gaints_name = ['歐陽修','蘇洵','蘇轍','蘇軾','王安石','曾鞏']
    
    for gaint, name in zip(gaints, gaints_name):
        print(node_partition2[gaint], gaint, name)
    # f = open('tmp.txt', 'w')
    # print(part_neg, file=f)
    # f.close()
    # with open('tmp.txt') as f:
    #     print(f.read())
    # ig.plot(part_neg)


def compute_imblance():
    '''
    计算划分方法导致的imblace结果
    '''
    pass


def get_top_people(sub_g, topk=10):
    people_df = pd.read_csv('./csv/宋.csv')
    with open('./results/song_centrality.json') as f:
        json_data = json.load(f)
        top_degree = []
        for people in sub_g.nodes():
            heapq.heappush(top_degree, (json_data[people][0], json_data[people], people))
    
    topk = heapq.nlargest(topk, top_degree)
    datas = []
    for i in topk:
        name1 = people_df[people_df.nid == int(i[2])]['ChName']
        name2 = people_df[people_df.nid == int(i[2])]['EngName']
        print("".join(name1.values),",", "".join(name2.values),",",i[2],",",",".join([str(round(j, 3)) for j in i[1]]))
        d = dict()
        d["EngName"] = "".join(name2.values)
        d["ChName"] = "".join(name1.values)
        d["PersonID"] = i[2]
        d["c1"] = round(i[1][0], 3)
        d["c2"] = round(i[1][1], 3)
        d["c3"] = round(i[1][2], 3)
        d["c4"] = round(i[1][3], 3)
        datas.append(d)
    print(json.dumps(datas))

def main():
    # gexf_path = os.path.join(VIS_DATA_DIR, 'song-signed.gexf')
    # origin_gexf_g = nx.read_gexf(gexf_path)
    # gaints = ['1384', '3762', '1493', '3767', '1762', '7364']
    # sub_g = get_subgraph(node_lists=gaints, depth=0, graph_path='song-signed.gexf')
    
    # get_top_people(sub_g, 20)
    naive_plot()
    # layer_partition()
    
    # graphml_path = os.path.join(VIS_DATA_DIR, 'song-tmp.graphml')
    # nx.write_graphml(sub_g, graphml_path)
    # G = ig.Graph.Read_GraphML(graphml_path)

    # partition = louvain.find_partition(G, louvain.ModularityVertexPartition,weights='weight')
    # print(partition) # BaseException: Could not construct partition: Cannot accept negative weights.

    # print(type(partition), dir(partition))
    # G = ig.Graph.Famous('Zachary')
    # for edge in G.get_edgelist():
    #     print(edge)
    # G_pos = G.subgraph_edges(G.es.select(weight_gt = 0), delete_vertices=False)
    # G_neg = G.subgraph_edges(G.es.select(weight_lt = 0), delete_vertices=False)
    # G_neg.es['weight'] = [-w for w in G_neg.es['weight']]
    # optimiser = louvain.Optimiser()
    # part_pos = louvain.ModularityVertexPartition(G_pos, weights='weight')
    # part_neg = louvain.ModularityVertexPartition(G_neg, weights='weight')
    # diff = optimiser.optimise_partition_multiplex([part_pos, part_neg],layer_weights=[1,-1])
    # print(diff)
    # for v in G.vs:
    #     print(v.index, v["label"])
    # G.write_graphml('test.graphml')
    # partition = louvain.find_partition(G, louvain.ModularityVertexPartition)

    # ig.plot(partition) 


if __name__ == '__main__':
    main()