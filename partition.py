#coding=utf8
import os
import json

import networkx as nx
import igraph as ig
import louvain

VIS_DATA_DIR = './vis_datas'

def main():
    gexf_path = os.path.join(VIS_DATA_DIR, 'song-signed.gexf')
    origin_gexf_g = nx.read_gexf(gexf_path)
    # pajek_path = os.path.join(VIS_DATA_DIR, 'song-signed.net')
    # nx.write_pajek(origin_gexf_g, pajek_path)
    graphml_path = os.path.join(VIS_DATA_DIR, 'song-signed.graphml')
    nx.write_graphml(origin_gexf_g, graphml_path)
    G = ig.Graph.Read_GraphML(graphml_path)
    partition = louvain.find_partition(G, louvain.ModularityVertexPartition)
    print(partition)

if __name__ == '__main__':
    main()