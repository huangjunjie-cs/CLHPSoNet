#!/usr/bin/env python
# coding=utf-8
__author__ = 'h12345jack'
import os
import time


import louvain
import igraph as ig
import networkx as nx

from louvain import Optimiser
from .functions import get_subgraph


# 调用函数

def layer_partition(sub_g, gaints):
    

    # sub_g = get_subgraph(node_lists = ['1384', '3762', '1493', '3767', '1762', '7364'], depth=0)
    #8175
    #sub_g = get_subgraph(node_lists = ['8175', '8008'], depth=1)
    now_time = time.time()
    graphml_path = 'song-tmp{}.graphml'.format(now_time)
    nx.write_graphml(sub_g, graphml_path)

    G = ig.Graph.Read_GraphML(graphml_path)
    G_pos = G.subgraph_edges(G.es.select(weight_gt = 0), delete_vertices=False)
    G_neg = G.subgraph_edges(G.es.select(weight_lt = 0), delete_vertices=False)
    G_neg.es['weight'] = [-w for w in G_neg.es['weight']]
    part_pos = louvain.ModularityVertexPartition(G_pos, weights='weight')
    part_neg = louvain.ModularityVertexPartition(G_neg, weights='weight')
    optimiser = louvain.Optimiser()
    diff = optimiser.optimise_partition_multiplex([part_pos, part_neg],layer_weights=[1,-1])
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
