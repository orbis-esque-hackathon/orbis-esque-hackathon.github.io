#! python
"""
Script to convert YAML settings file for route weight modifiers to includable
Javascript global variable assignments.  The variables generated are used by
James Baillie's dynamic weight rounting code in graph.js
"""

from yaml import load, dump
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

import json


def yaml_load(filename):
    """
    Load YAML data, return Python structure
    """
    with open(filename,"r") as yamlstr:
        data = load(yamlstr, Loader=Loader)
    return data

def json_dump(data, filename):
    """
    Dump supplied data as JSON to named file.
    """
    with open(filename,"w") as jsonstr:
        json.dump(data, jsonstr, indent=4, separators=(', ', ': '))
    return

def convert_settings(settings):
    """
    Convert settings from YAML data to form used by dynamic weight routing code.

    Returns two structures: 
    - a list of setting names and types and associated values
    - a dictionary indexed by setting name for mapping setting values to weights
    """
    modifiers = settings["modifiers"]
    setting_types    = [["Meter","Num",1,-1, 1]]
    setting_mappings = {}
    for setting_name in modifiers:
        setting_types.append([setting_name, "Typ", 1, setting_name, 1])
        m = modifiers[setting_name].items()
        setting_mappings[setting_name] = m
        # ["Type","Typ",1,0],   // 1=apply weight, 0=index into translation list
    return (setting_types, setting_mappings)    

def write_js_globals(filename, setting_types, setting_mappings):
    """
    Write (converted) setting types and mapping data as Javascript variable assignments.
    """
    with open(filename,"w") as jsstr:
        jsstr.write("/* %s - auto-generated by %s */\n\n"%(filename, __file__))
        jsstr.write(
            "weweights = [\n    %s\n    ]\n"%
            ",\n    ".join([json.dumps(w) for w in setting_types])
            # (json.dumps(setting_types, indent=4, separators=(', ', ': ')))
            )
        typ_map_list_list = (
            [ (m, [ json.dumps(v) for v in setting_mappings[m] ])
              for m in setting_mappings
            ])
        typ_map_list = (
            [ '"%s":\n        [ %s\n        ]'%(m, ",\n          ".join(l)) for m, l in typ_map_list_list]
            )
        typ_map_str = "\n    , ".join(typ_map_list)
        jsstr.write("\n\ntypetranslator =\n    { %s\n    }\n"%(typ_map_str))
        # jsstr.write(
        #     "\n\ntypetranslator =\n    { %s\n    }"%
        #     "\n    , ".join(["%s: %s"%(m, json.dumps(setting_mappings[m])) for m in setting_mappings])
        #     # (json.dumps(setting_mappings, indent=4, separators=(', ', ': ')))
        #     )
        jsstr.write("\n\n/* End */\n")
    return

if __name__ == "__main__":
    """
    Main program

    @@TODO: get filename(s) from command line.
    """
    settings = yaml_load("sample-settings.yaml")
    # print(repr(settings))
    # json_dump(settings, "sample-settings.json")
    setting_types, setting_mappings = convert_settings(settings)
    write_js_globals("sample-settings.js", setting_types, setting_mappings)

