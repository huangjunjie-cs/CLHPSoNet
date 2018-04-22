#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import json
import re

from collections import defaultdict

# import matplotlib.pyplot as plt
import networkx as nx
import pandas as pd

DATA_DIR = './datas/datas'

DYNASTY = {'唐': (618, 907), '宋': (960, 1279), '元': (1271, 1368), '明': (1368, 1644), '清': (1636, 1912)}
dylist = [('唐', 'tang'), ('宋', 'song'), ('元', 'yuan'), ('明' , 'ming'), ('清', 'qing')]


def is_dynasty(dynasty, json_data, person_id):
    # 满足三种条件之一即可
    # 朝代
    # 出生时间在范围内
    # 死亡时间在范围内
    # json_data -> ['Package']['PersonAuthority']['PersonInfo']['Person']
    error_f = open('error_years.log', 'a')
    if json_data['BasicInfo']['Dynasty'] == dynasty:
        return True
    year_birth = json_data['BasicInfo']['YearBirth']
    year_death = json_data['BasicInfo']['YearDeath']
    
    try:
        year_birth = int(year_birth)
        if year_birth >= DYNASTY[dynasty][0] and (year_birth<= DYNASTY[dynasty][1]):
            return True
    except Exception as e:
        print(person_id, e, 'birth_year none', file=error_f)
        
        try:
            year_death = int(year_death)

            if year_death >= DYNASTY[dynasty][0] and (year_death<= DYNASTY[dynasty][1]):
                return True
        except Exception as e:
            print(person_id, e, 'death_year none', file=error_f)
    return False

def handle_dynasty():
    '''
    数据整理为朝代
    '''
    for dynasty in DYNASTY:
        if not os.path.exists('datas/{}'.format(dynasty)):
            os.mkdir('datas/{}'.format(dynasty))
    json_error_f = open('json_error.log', 'w')
    for fname in os.listdir(DATA_DIR):
        fpath = os.path.join(DATA_DIR, fname)
        with open(fpath) as f:
            try:
                json_data = json.load(f)
                person_data = json_data['Package']['PersonAuthority']['PersonInfo']['Person']
                for dynasty in DYNASTY:
                    if is_dynasty(dynasty, person_data, fname):
                        result_path = os.path.join('datas', dynasty, fname)
                        with open(result_path, 'w') as f2:
                            f2.write(json.dumps(person_data))
                        print(fname, dynasty)
            except Exception as e:
                print(fpath, e, file = json_error_f)

def statistic_relation():
    '''
    社交关系
    '''
    relations = set()
    relations_codes = set()
    relations_c = defaultdict(int)
    error = 0
    for fname in os.listdir(DATA_DIR):
        fpath = os.path.join(DATA_DIR, fname)
        with open(fpath) as f:
            try:
                json_data = json.load(f)
                if 'Person' not in json_data['Package']['PersonAuthority']['PersonInfo']:
                    continue
                person_data = json_data['Package']['PersonAuthority']['PersonInfo']['Person']
                if 'PersonSocialAssociation' in person_data:
                    person_association = person_data["PersonSocialAssociation"]
                    if 'Association' in person_association:
                        person_assoc = person_association['Association']
                        if isinstance(person_assoc, list):
                            for person in person_association['Association']:
                                if 'AssocName' in person and 'AssocCode' in person:
                                    relations.add(person['AssocName'])
                                    relations_codes.add(person['AssocCode'])
                                    tmp = (person['AssocName'], person['AssocCode'])
                                    relations_c[tmp] += 1
                        elif isinstance(person_assoc, dict):
                            relations.add(person['AssocName'])
                            relations_codes.add(person['AssocCode'])
                            tmp = (person['AssocName'], person['AssocCode'])
                            relations_c[tmp] += 1
            except json.decoder.JSONDecodeError as e:
                error += 1
    print(len(relations), len(relations_codes), len(relations_c))
    print(relations)
    print(relations_codes)
    for r in relations_c:
        print(r[0], ',', r[1], ',', relations_c[r])


def statistic_social_status():
    '''
    统计社会地位
    '''
    entry_dict = defaultdict(int)
    social_status_dict = defaultdict(int)
    error = 0
    for fname in os.listdir(DATA_DIR):
        fpath = os.path.join(DATA_DIR, fname)
        with open(fpath) as f:
            try:
                json_data = json.load(f)
                # print(json_data)
                if 'Person' not in json_data['Package']['PersonAuthority']['PersonInfo']:
                    continue
                person_data = json_data['Package']['PersonAuthority']['PersonInfo']['Person']
                if 'PersonEntryInfo' in person_data and 'Entry' in person_data['PersonEntryInfo']:
                    tmp = person_data['PersonEntryInfo']['Entry']
                    if isinstance(tmp, list):
                        for tmp2 in tmp:
                            if 'RuShiDoor' in tmp2:
                                tmp3 = tmp2['RuShiDoor']
                                entry_dict[tmp3] += 1
                    else:
                        tmp3 = tmp['RuShiDoor']
                        entry_dict[tmp3] += 1
                if 'PersonSocialStatus' in person_data and 'SocialStatus' in person_data['PersonSocialStatus']:
                        tmp = person_data['PersonSocialStatus']['SocialStatus']
                        if isinstance(tmp, list):
                            for tmp2 in tmp:
                                tmp3 = tmp2['StatusName']
                                social_status_dict[tmp3] += 1
                        else:
                            tmp3 = tmp['StatusName']
                            social_status_dict[tmp3] += 1
            except json.decoder.JSONDecodeError as e:
                    error += 1
    print(entry_dict, social_status_dict)
    

def network_extract(dynasty = '唐'):
    '''
    抽取出社交关系图
    '''
    edge_lists = []
    count = 0
    node_num = 0
    dynasty_dir = os.path.join('datas', dynasty)
    for fname in os.listdir(dynasty_dir):
        node_num += 1
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
                            #print(fname[:fname.rfind('.')], person['AssocPersonId'])
                            edge_lists.append((fname[:fname.rfind('.')], person['AssocPersonId']))
                        count +=1
                        #if count > 10:break
                elif isinstance(person_assoc, dict):
                    #print('dict:', fname[:fname.rfind('.')], person_assoc['AssocPersonId'])
                    edge_lists.append((fname[:fname.rfind('.')], person_assoc['AssocPersonId']))
                    count += 1
    print(count, node_num)
    G = nx.Graph()
    G.add_edges_from(edge_lists)
    return G

def network_attribute_export(dynasty = '唐'):
    '''
    对应节点的属性数据导出
    '''
    node_list = []
    dynasty_dir = os.path.join('datas', dynasty)
    for fname in os.listdir(dynasty_dir):
        fpath = os.path.join(dynasty_dir, fname)
        f = open(fpath)
        json_data = json.load(f)
        node_attr = dict()
        node_attr['nid'] = fname[:fname.rfind('.')]
        basic = json_data['BasicInfo']
        for i in basic:
            node_attr[i] = basic[i]

        # 入仕属性
        if 'PersonEntryInfo' in json_data and 'Entry' in json_data['PersonEntryInfo']:
            tmp = json_data['PersonEntryInfo']['Entry']
            entry = []
            if isinstance(tmp, list):
                for tmp2 in tmp:
                    if 'RuShiDoor' in tmp2:
                        tmp3 = tmp2['RuShiDoor']
                        entry.append(tmp3)
            else:
                tmp3 = tmp['RuShiDoor']
                entry.append(tmp3)
            node_attr['Entry'] = ';'.join(entry)

        # 社会地位
        if 'PersonSocialStatus' in json_data and 'SocialStatus' in json_data['PersonSocialStatus']:
            tmp = json_data['PersonSocialStatus']['SocialStatus']
            social_status = []
            if isinstance(tmp, list):
                for tmp2 in tmp:
                    tmp3 = tmp2['StatusName']
                    social_status.append(tmp3)
            else:
                tmp3 = tmp['StatusName']
                social_status.append(tmp3)
            node_attr['SocialStatus'] = ';'.join(social_status)
        node_list.append(node_attr)

    df = pd.DataFrame(node_list)
    df.to_csv(dynasty + '.csv')

def compute_network_info(dy):
    file_path = './vis_datas/'+dy[1]+'.gexf'
    g = nx.read_gexf(file_path)
    # connected_g = nx.connected_components(g)
    print(dy[0])
    cluster_coeff = nx.average_clustering(g)
    print('clustering_coefficient', cluster_coeff)
    for i in nx.connected_components(g):
        largest_nodes = i
        largest_g = g.subgraph(largest_nodes)
        nx.write_gexf(largest_g, './vis_datas/' + dy[1] + '_largest_connected.gexf')
        cluster_coeff = nx.average_clustering(largest_g)
        print(dy[0], 'largest connected subgraph')
        print('clustering_coefficient', cluster_coeff)
        print(nx.info(largest_g))
        print('average_shortest_path_length', nx.average_shortest_path_length(largest_g))
        break

def compute_centrality(dy):
    '''
    中心度衡量：
    度中心，
    介数
    接近
    特征根
    
    '''
    dy_name = dy[0]
    dy_pingyin = dy[1]
    print(dy_name)
    file_path = './vis_datas/'+dy[1]+'.gexf'
    g = nx.read_gexf(file_path)
    result = defaultdict(list)
    degree_cen = nx.degree_centrality(g)
    for i in degree_cen:
        result[i].append(i)
    print('degree done')
    bet_cen = nx.betweenness_centrality(g)
    for i in bet_cen:
        result[i].append(i)
    print('betweenness done')
    
    close_cen =  nx.closeness_centrality(g)
    for i in close_cen:
        result[i].append(i)
    print('closeness done')

    eig_cen = nx.eigenvector_centrality(g)
    for i in eig_cen:
        result[i].append(i)
    print('eigenvector done')
    
    with open('./results/{}_centrality.json'.format(dy_pingyin), 'w') as f:
        f.write(json.dumps(result))
    

def main():
    # handle_dynasty()
    # test()
    # statistic_relation()
    # for dy in dylist:
    compute_centrality(dylist[4])
    
            

        

if __name__ == "__main__":
    main()
