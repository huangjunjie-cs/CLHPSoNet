#coding=utf8
import os
import json

from collections import defaultdict

import networkx as nx
import igraph as ig
import louvain

VIS_DATA_DIR = './vis_datas'


def get_subgraph(node_lists = ['1762'], depth = 3):
    '''
    node-list 是起点节点，
    depth是深度
    '''
    gexf_path = os.path.join(VIS_DATA_DIR, 'song.gexf')
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

def main():
    get_subgraph(node_lists = ['1762'], depth=1)

if __name__ == '__main__':
    main()