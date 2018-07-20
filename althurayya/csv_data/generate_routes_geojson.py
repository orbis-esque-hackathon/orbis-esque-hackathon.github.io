import csv
import geojson
import json
import ast
# fruits = ast.literal_eval(fruits)

import yaml
def loadYaml(yamlFile):
    with open(yamlFile, "r", encoding="utf8") as f1:
        raw = f1.read()
    obj = yaml.load(raw)
    return(obj)

settings = loadYaml("settings.yml")
#print(settings)

def generate_geojson_routes(values, input_file, output_file):
    features = []
    with open(input_file, "r", encoding="utf8") as f:
        routes = csv.DictReader(f, delimiter="\t")
        for r in routes:
            l = ast.literal_eval(r['coordinates'])
            tmp = []
            for c in l:
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
        writer = geojson.dump(f_collection, out_geo, indent=4)

#print(settings)

def generateGeoJsonData():

    for d in settings["data"]:
        # routes values
        rFile = settings["data"][d]["routesFile"]
        rValues = settings["data"][d]["routesProperties"]
        generate_geojson_routes(rValues, rFile+".csv", rFile+"_TEST.geojson")

        # settlements values



generateGeoJsonData()
    
