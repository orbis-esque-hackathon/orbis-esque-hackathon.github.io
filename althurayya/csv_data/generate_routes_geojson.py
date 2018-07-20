import csv
import geojson
import json
import ast
# fruits = ast.literal_eval(fruits)

def generate_geojson(input_file, output_file):
    features = []
    with open(input_file, "r", encoding="utf8") as f:
        routes = csv.DictReader(f, delimiter="\t")
        for r in routes:
            l = ast.literal_eval(r['coordinates'])
            tmp = []
            for c in l:
                tmp.append((float(c[0]), float(c[1])))
            feature = geojson.Feature(geometry=geojson.LineString(tmp),
                                      properties={"route_id": r["route_id"], "sToponym": r['sToponym'],
                                                  'sToponym_type': r['sToponym_type'], "eToponym": r['eToponym'],
                                                  'eToponym_type': r['eToponym_type'], "terrain": r['terrain'],
                                                  "safety": r['safety'], 'meter': r['meter']})
            features.append(feature)
    f_collection = geojson.FeatureCollection(features)
    with open(output_file, 'w') as out_geo:
        writer = geojson.dump(f_collection, out_geo, indent=4)


generate_geojson("/home/rostam/projs/orbis-esque-hackathon.github.io/althurayya/master/routes_wgt.csv",
                 "/home/rostam/projs/orbis-esque-hackathon.github.io/althurayya/master/routes_wgt.geojson")
