# import matplotlib.pyplot as plt
import networkx as nx
import os
import json
import re

DATA_DIR = './datas/datas'


def read_dynasty(dynasty = '宋'):
    edge_lists = []
    count = 0
    t = 0
    dynasty_dir = os.path.join('datas', dynasty)
    for fname in os.listdir(dynasty_dir):
        t += 1
        fpath = os.path.join(dynasty_dir, fname)
        f = open(fpath)
        json_data = json.load(f)
        if 'PersonSocialAssociation' in json_data:
            person_association = json_data["PersonSocialAssociation"]
            if 'Association' in person_association:
                person_assoc = person_association['Association']
                if isinstance(person_assoc, list):
                    for person in person_association['Association']:
                        if 'AssocPersonId' in person:
                            person_b = person['AssocPersonId']
                            person_a = fname[:fname.rfind('.')]
                            edge_lists.append((person_a, person_b))
                        count +=1
                elif isinstance(person_assoc, dict):
                    person_b = person_assoc['AssocPersonId']
                    person_a = fname[:fname.rfind('.')]
                    edge_lists.append((person_a, person_b))
                    count += 1
    print(count, t)
    print(len(edge_lists), len(set(edge_lists)))
    G = nx.DiGraph()
    G.add_edges_from(edge_lists)
    #nx.draw(G, with_labels=False, font_weight='bold')
    print(nx.info(G)) 
    return G


def main():
    read_dynasty()

if __name__ == "__main__":
    main()