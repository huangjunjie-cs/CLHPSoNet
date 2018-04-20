#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import json


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
            

def main():
    handle_dynasty()
            

        

if __name__ == "__main__":
    main()
