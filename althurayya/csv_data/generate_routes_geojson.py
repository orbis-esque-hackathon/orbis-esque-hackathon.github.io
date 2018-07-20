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

def generate_geojson(sValues, input_file, output_file):
    features = []
    with open(input_file, "r", encoding="utf8") as f:
        routes = csv.DictReader(f, delimiter="\t")
        for r in routes:
            l = ast.literal_eval(r['coordinates'])
            tmp = []
            for c in l:
                tmp.append((float(c[0]), float(c[1])))
            # generate properties dictionary
            properties = {}
            for s in sValues:
                pass
            feature = geojson.Feature(geometry=geojson.LineString(tmp),
                                      properties={"id": r[sValues["id"]], "sToponym": r[sValues["sToponym"]],
                                                  'sToponym_type': r['sToponym_type'], "eToponym": r['eToponym'],
                                                  'eToponym_type': r['eToponym_type'], "terrain": r['terrain'],
                                                  "safety": r['safety'], 'meter': r['meter']})
                                    
##                                      properties={"route_id": r["route_id"], "sToponym": r['sToponym'],
##                                                  'sToponym_type': r['sToponym_type'], "eToponym": r['eToponym'],
##                                                  'eToponym_type': r['eToponym_type'], "terrain": r['terrain'],
##                                                  "safety": r['safety'], 'meter': r['meter']})
            features.append(feature)
    f_collection = geojson.FeatureCollection(features)
    with open(output_file, 'w') as out_geo:
        writer = geojson.dump(f_collection, out_geo, indent=4)

print(settings)

def generateGeoJsonData():

    for d in settings["data"]:
        # settlement values
        sFile = settings["data"][d]["routesFile"]
        sValues = settings["data"][d]["routesProperties"]

        print(sValues)

        for s in sValues:
            print(s)

        


        #generate_geojson(routeFile+".csv", routeFile+".geojson")
    
    
    #generate_geojson(inputFile, outputFile)


generateGeoJsonData()
    
