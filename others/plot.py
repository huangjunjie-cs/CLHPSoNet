#coding=utf8
import os
import json
import re
import collections
import math

import matplotlib
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import numpy as np
import networkx as nx


dylist = [('唐', 'tang'), ('宋', 'song'), ('元', 'yuan'), ('明' , 'ming'), ('清', 'qing')]

from networkx.algorithms import approximation as approx
def vis_degree_distribution(graph, dynasty):
    degree_seq = [d for n,d in graph.degree()]
    print(len(degree_seq), approx.node_connectivity(graph))
    degree = sorted(degree_seq, reverse=True)
    print(min(degree))
    degreeCount = collections.Counter(degree)
    deg, cnt = zip(*degreeCount.items())
    ln_deg = [math.log(i, 10) for i in deg]
    ln_cn = [math.log(i, 10) for i in cnt]
#     plt.bar(deg, cnt, width=0.8)
    ax = plt.subplot()
    ax.scatter(ln_deg, ln_cn, marker='+')
   # print([i for i in ax.get_xticks()])
    print([10**i for i in ax.get_xticks()])
    ax.set_xticklabels([round(10**i,1) for i in ax.get_xticks()])
    ax.set_yticklabels([round(10**i,1) for i in ax.get_yticks()])
    ax.set_title(dynasty[0].upper() + dynasty[1:])
    #plt.yticks()
    ax.set_ylabel('frequency')
    ax.set_xlabel('degree')
    plt.show()

for dy in dylist:
    file_path = './vis_datas/'+dy[1]+'.gexf'
    g = nx.read_gexf(file_path)
    print(dy[0])
    vis_degree_distribution(g, dy[1])




