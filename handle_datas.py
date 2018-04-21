#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import json
import re

from collections import defaultdict

# import matplotlib.pyplot as plt
import networkx as nx

DATA_DIR = './datas/datas'

DYNASTY = {'唐': (618, 907), '宋': (960, 1279), '元': (1271, 1368), '明': (1368, 1644), '清': (1636, 1912)}
error_f = open('error_years.log', 'w')

def is_dynasty(dynasty, json_data, person_id):
    # 满足三种条件之一即可
    # 朝代
    # 出生时间在范围内
    # 死亡时间在范围内
    # json_data -> ['Package']['PersonAuthority']['PersonInfo']['Person']
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
    


def main():
    # handle_dynasty()
    # test()
    statistic_relation()
    
            

        

if __name__ == "__main__":
    main()
