import csv
import geojson
import json
import ast

import yaml

def load_settings(yaml_file):

    with open(yaml_file, "r", encoding="utf8") as f1:
        raw = f1.read()
    obj = yaml.load(raw)
    return obj


def generate_geojson_routes(values, input_file, output_file):
    features = []
    with open(input_file, "r", encoding="utf8") as f:
        routes = csv.DictReader(f, delimiter="\t")
        for r in routes:
            coords = ast.literal_eval(r['coordinates'])
            tmp = []
            for c in coords:
                tmp.append((float(c[0]), float(c[1])))
            # generate properties dictionary
            pDic = {}
            for s in values:
                if s == "Meter":
                    pDic[s] = int(r[values[s]])
                else:
                    pDic[s] = r[values[s]]
            # creating a feature
            feature = geojson.Feature(geometry=geojson.LineString(tmp),
                                      properties=pDic)
            features.append(feature)

    f_collection = geojson.FeatureCollection(features)
    with open(output_file, 'w') as out_geo:
        geojson.dump(f_collection, out_geo, indent=4, ensure_ascii=False)


def generate_geojson_places(values, input_file, output_file):
    features = []
    with open(input_file, "r", encoding="utf8") as f:
        routes = csv.DictReader(f, delimiter="\t")
        for r in routes:
            coords = ast.literal_eval(r['coordinates'])

            # generate properties
            p = {}
            p['althurayyaData'] = {}
            p['althurayyaData']['names'] = {}
            for l in ast.literal_eval(r['languages']):
                p['althurayyaData']['names'][l] = {}

            for v in values:
                if v != "names":
                    p['althurayyaData'][v] = r[values[v]]
                else:
                    for n in values['names']:
                        tmp = n.split("_", 1) # ara_common(_...), "1" is max split to just
                        # tmp[0] = ara, eng, etc. -- tmp[1] = common, common_other, etc.
                        p['althurayyaData']["names"][tmp[0]] = {tmp[1]: r["names_" + n]}


            # creating a feature
            feature = geojson.Feature(geometry=geojson.Point(coords),
                                      properties=p)
            features.append(feature)

    f_collection = geojson.FeatureCollection(features)
    with open(output_file, 'w') as out_geo:
        geojson.dump(f_collection, out_geo, indent=4, ensure_ascii=False)


def generate_geoJson_data(settings):

    for d in settings["data"]:
        # routes values
        r_file = settings["data"][d]["routesFile"]
        r_values = settings["data"][d]["routesProperties"]
        generate_geojson_routes(r_values, r_file+".csv", r_file+".geojson")

        # settlements values
        p_file = settings["data"][d]["settlementFile"]
        p_values = settings["data"][d]["settlementProperties"]
        generate_geojson_places(p_values, p_file+".csv", p_file+".geojson")


if __name__ == '__main__':

    settings = load_settings("settings.yml")
    generate_geoJson_data(settings)
    
