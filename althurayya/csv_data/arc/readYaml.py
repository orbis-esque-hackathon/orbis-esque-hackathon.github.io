import yaml

def loadYaml(yamlFile):
    with open(yamlFile, "r", encoding="utf8") as f1:
        raw = f1.read()

    obj = yaml.load(raw)
    print(obj)




loadYaml("settings.yml")
