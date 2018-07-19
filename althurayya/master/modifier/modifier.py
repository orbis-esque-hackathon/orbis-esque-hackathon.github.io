import re, json

def loadSettings(yml):
    with open(yml, "r", encoding="utf8") as f1:
        raw = f1.read().split("\n")

        data = {}

        for r in raw:
            r = r.split(":")
            data[r[0].strip()] = float(r[1].strip())

    return(data)

def leadSettlements(settlements):
    with open(settlements, "r", encoding="utf8") as f1:
        obj = json.loads(f1.read())

        dic = {}

        for f in obj["features"]:
            uri = f["properties"]["althurayyaData"]["URI"]
            top_type = f["properties"]["althurayyaData"]["top_type"]

            dic[uri] = mods[top_type]

        return(dic)

def addWeights(edgesFile):
    with open(edgesFile, "r", encoding="utf8") as f1:
        edges = json.loads(f1.read())

        for f in edges["features"]:
            div1 = modVals[f['properties']['sToponym']]
            div2 = modVals[f['properties']['eToponym']]
            length = int(f['properties']['Meter'])
            weight = int(length / div1 / div2)
            f['properties']['Weight'] = weight 
            
            #input(f)
            
        with open(edgesFile.replace(".json", "_wgt.json"), "w", encoding="utf-8") as f9:
            json.dump(edges, f9, indent=4, sort_keys=True, ensure_ascii=False)

    

mods = loadSettings("settings.yml")
modVals = leadSettlements("../places_new_structure.geojson")
addWeights("../routes.json")


            
        
