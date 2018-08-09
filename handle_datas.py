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

# 创建log文件夹
if not os.path.exists('logs'):
    os.mkdir('logs')

# 创建结果文件夹
if not os.path.exists('results'):
    os.mkdir('results')

# 创建csv文件夹
if not os.path.exists('csv'):
    os.mkdir('csv')



def is_dynasty(dynasty, json_data, person_id):
    # 满足三种条件之一即可
    # 朝代
    # 出生时间在范围内
    # 死亡时间在范围内
    # json_data -> ['Package']['PersonAuthority']['PersonInfo']['Person']
    error_f = open('./logs/error_years.log', 'a')
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
    json_error_f = open('./logs/json_error.log', 'a')
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
    社交关系统计
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
            except json.decoder.JSONDecodeError:
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
    with open('entry-dict.json', 'w') as f:
        f.write(json.dumps(entry_dict))
    print('entry status done!')
    with open('social-status-dict.json', 'w') as f:
        f.write(json.dumps(social_status_dict))
    print('social-status done!')
    
def network_extract(dy):
    '''
    抽取出社交关系图
    '''
    edge_lists = []
    count = 0
    node_num = 0
    dynasty = dy[0]
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
                            person_b = person['AssocPersonId']
                            person_a = fname[:fname.rfind('.')]
                            edge_lists.append((person_a, person_b))
                        count +=1
                elif isinstance(person_assoc, dict) and 'AssocPersonId' in person_assoc:
                    #print('dict:', fname[:fname.rfind('.')], person_assoc['AssocPersonId'])
                    person_b = person_assoc['AssocPersonId']
                    person_a = fname[:fname.rfind('.')]
                    edge_lists.append((person_a, person_b))
                    count += 1
    print(count, node_num)
    #############
    v = 0
    nodes=set()
    for i in edge_lists:
        if i[0] == '1762' or i[1] == '1762':
            nodes.add(i[0])
            nodes.add(i[1])
    print(len(nodes))
    ##########
    G = nx.Graph()
    G.add_edges_from(edge_lists)
    return G

def network_attribute_export(dy):
    '''
    对应节点的属性数据导出
    '''
    node_list = []
    dynasty = dy[0]
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
    df.to_csv('./csv'+ dynasty + '.csv')

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
        result[i].append(degree_cen[i])
    print('degree done')
    bet_cen = nx.betweenness_centrality(g)
    for i in bet_cen:
        result[i].append(bet_cen[i])
    print('betweenness done')
    
    close_cen =  nx.closeness_centrality(g)
    for i in close_cen:
        result[i].append(close_cen[i])
    print('closeness done')

    eig_cen = nx.eigenvector_centrality(g)
    for i in eig_cen:
        result[i].append(eig_cen[i])
    print('eigenvector done')
    
    with open('./results/{}_centrality.json'.format(dy_pingyin), 'w') as f:
        f.write(json.dumps(result))
    
def signed_graph_extract(dy):
    '''
    
    将朝代的关系的signed加入，分别得到总体、postive、negtive的网络
    '''
    dy_name = dy[0]
    dy_pingyin = dy[1]
    count = 0
    print(dy_name, 'signed graph extracting')
    df = pd.read_csv("signed.csv")
    signed_data = df.to_dict('records')
    sigend_edge = defaultdict(int)
    for i in signed_data:
        sigend_edge[str(i['code'])] = i['signed']
    
    dynasty_dir = os.path.join('datas', dy_name)
    relations_pos = defaultdict(int)
    relations_neg = defaultdict(int)
    relations_v = defaultdict(int)

    node_num = 0
    for fname in os.listdir(dynasty_dir):
        node_num += 1
        fpath = os.path.join(dynasty_dir, fname)
        with open(fpath) as f:
            person_data = json.load(f)
            if 'PersonSocialAssociation' in person_data:
                person_association = person_data["PersonSocialAssociation"]
                if 'Association' in person_association:
                    person_assoc = person_association['Association']
                    if isinstance(person_assoc, list):
                        for person in person_association['Association']:
                            # if 'AssocName' in person and 'AssocCode' in person and 'AssocPersonId' in person:
                            if 'AssocPersonId' in person:
                                person_b = person['AssocPersonId']
                                person_a = fname[:fname.rfind('.')]
                                relation_codes = person['AssocCode']
                                signed_v = sigend_edge[relation_codes]
                                a_2_b = (person_a, person_b)
                                if signed_v > 0:
                                    relations_pos[a_2_b] += signed_v
                                    relations_v[a_2_b] += signed_v
                                else:
                                    relations_neg[a_2_b] += signed_v
                                    relations_v[a_2_b] += signed_v
                                count += 1
                    elif isinstance(person_assoc, dict) and 'AssocPersonId' in person_assoc:
                        person_b = person_assoc['AssocPersonId']
                        person_a = fname[:fname.rfind('.')]
                        relation_codes = person_assoc['AssocCode']
                        signed_v = sigend_edge[relation_codes]
                        a_2_b = (person_a, person_b)
                        if signed_v > 0:
                            relations_pos[a_2_b] += signed_v
                            relations_v[a_2_b] += signed_v
                        elif signed_v < 0:
                            relations_neg[a_2_b] += signed_v
                            relations_v[a_2_b] += signed_v
                        else:
                            relations_v[a_2_b] += signed_v
                        count += 1
        # if node_num > 0:
        #     break
    # 测试欧阳修和王安石
    # 1384 , 1762
    # print(relations_neg)
    # print(relations_pos)
    # print(relations_v)
    print(dy_name, 'signed graph extracted', count, node_num)
    print(relations_v[('1384','1762')], relations_v[('1762','1384')] )
    print(relations_pos[('1384','1762')], relations_pos[('1762','1384')] )
    print(relations_neg[('1384','1762')], relations_neg[('1762','1384')] )

    ####################
    # 测试是否对称，答案，不对称
    # for i in relations_v:
    #     n_v = (i[-1], i[0])
    #     v1 = relations_v[i]
    #     v2 = 0 if n_v not in relations_v else relations_v[n_v]
    #     if v1 != v2:
    #         print(i)
    ####################
    
    ####################
    nodes = set()
    for i in relations_v:
        if i[0] == '1762' or i[1] == '1762':
            nodes.add(i[0])
            nodes.add(i[1])
    print(len(nodes))
    ####################

    
    # 需要取较大值
    G = nx.Graph()
    for i in relations_v:
        n_v = (i[-1], i[0])
        v1 = relations_v[i]
        v2 = 0 if n_v not in relations_v else relations_v[n_v]
        v = v1 if abs(v1) > abs(v2) else v2
        G.add_edge(i[0], i[1], weight=v)
    nx.write_gexf(G, './vis_datas/{}-signed.gexf'.format(dy_pingyin))

    G = nx.Graph()
    for i in relations_pos:
        n_v = (i[-1], i[0])
        v1 = relations_pos[i]
        v2 = 0 if n_v not in relations_pos else relations_pos[n_v]
        v = v1 if abs(v1) > abs(v2) else v2
        G.add_edge(i[0], i[1], weight=v)
    nx.write_gexf(G, './vis_datas/{}-pos.gexf'.format(dy_pingyin))

    G = nx.Graph()
    for i in relations_neg:
        n_v = (i[-1], i[0])
        v1 = relations_neg[i]
        v2 = 0 if n_v not in relations_neg else relations_neg[n_v]
        v = v1 if abs(v1) > abs(v2) else v2
        G.add_edge(i[0], i[1], weight=v)
    nx.write_gexf(G, './vis_datas/{}-neg.gexf'.format(dy_pingyin))


def main():
    # step1 dyansty extraction
    # handle_dynasty()
    # step2 relationship statistic
    # statistic_relation() 
    
    # for dy in dylist:
    # compute_network_info(dylist[0])
    # signed_graph_extract(dylist[1])
    #G = network_extract(dylist[1])
    #nx.write_gexf(G, './vis_datas/{}.gexf'.format(dylist[1][1]))
    statistic_social_status()
    
            

        

if __name__ == "__main__":
    main()
