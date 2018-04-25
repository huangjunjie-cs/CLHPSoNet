#coding=utf8
import os
import json

from collections import defaultdict

import networkx as nx
import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import igraph as ig
import pandas as pd
import louvain
from louvain import Optimiser
from matplotlib.font_manager import FontProperties  
#font=FontProperties(fname='/System/Library/Fonts/STHeiti Medium.ttc')
# import 
VIS_DATA_DIR = './vis_datas'


def get_subgraph(node_lists = ['1762'], depth = 3):
    '''
    node-list 是起点节点，
    depth是深度
    '''
    gexf_path = os.path.join(VIS_DATA_DIR, 'song-signed.gexf')
    g = nx.read_gexf(gexf_path)
    # 
    g_edges = g.edges()
    g_edges_dict = defaultdict(set)
    for edge in g_edges:
        n1 = edge[0]
        n2 = edge[1]
        g_edges_dict[n1].add(n2)
        g_edges_dict[n2].add(n1)
    print(len(g_edges_dict['1762']))
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
    sub_g = get_subgraph(node_lists=gaints, depth=0)
    people_df = pd.read_csv('./csv/宋.csv')
    # print(people_df[(people_df.nid == int(1384))])
    # print(people_df.nid == '1384')
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
    print(edge_attrs)
    G = sub_g
    e_pos = [(u, v) for (u, v, d) in G.edges(data=True) if d['weight'] > 0]
    e_neg = [(u, v) for (u, v, d) in G.edges(data=True) if d['weight'] < 0]
    pos = nx.circular_layout(G)
    print(pos)
    # 为了保证画出来顺序是确定的，
    print(pos.items())
    values = sorted(pos.items(), key = lambda x:x[1][1]/x[1][0], reverse=True)
    print(values)
    pos_key = [i for i in pos.keys()]
    pos_key.sort()
    
    for index, i in enumerate(pos_key):
        pos[i] = values[index][1]

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
    sub_g = get_subgraph(node_lists = ['1384', '3762', '1493', '3767', '1762', '7364'], depth=1)
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
    while diff > 0:
        diff = optimiser.optimise_partition_multiplex([part_pos, part_neg],layer_weights=[1,-1])
    print(diff)
    # print(part_neg)
    # print(part_pos)
    # for v in G.vs:
    #     print(v.index, v["label"])
    # print(dir(part_pos), part_pos.membership)
    print(dir(part_pos))
    print(part_pos.modularity, part_pos.q, part_pos.summary())
    
    node_partition = {}
    for v in G.vs:
        node_partition[v["label"]] = v.index
    node_partition2 = {}
    memberships = [i for i in part_pos.membership]
    assert len(memberships) == len(node_partition)
    for i in node_partition:
        node_partition2[i] = memberships[node_partition[i]]
    # print(node_partition2)
    gaints = ['1384', '3762', '1493', '3767', '1762', '7364']
    gaints_name = ['歐陽修','蘇洵','蘇轍','蘇軾','王安石','曾鞏']
    
    for gaint, name in zip(gaints, gaints_name):
        print(node_partition2[gaint], name)
    # f = open('tmp.txt', 'w')
    # print(part_neg, file=f)
    # f.close()
    # with open('tmp.txt') as f:
    #     print(f.read())
    # ig.plot(part_neg)


def main():
    # naive_plot()
    layer_partition()
    
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