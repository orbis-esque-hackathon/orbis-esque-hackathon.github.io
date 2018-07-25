/**
 * Created by rostam on 25.09.16.
 */
// var colorLookup = {
//     //"Andalus": "#323449",
//     "Aqur": "#A768E6",
//     "Barqa": "#58E0C1",
//     "Daylam": "#D5812E",
//     "Egypt": "#6CD941",
//     "Faris": "#E23A80",
//     "Iraq": "#ABB1DB",
//     "Jibal": "#384E21",
//     "Khazar": "#00008B",
//     "Khurasan": "#B27E86",
//     "Khuzistan": "#8F351D",
//     "Kirman": "#D5AB7A",
//     "Mafaza": "#d3d3d3",//"#514285", has changed to light gray to set this region to background
//     "Maghrib": "#539675",
//     "Rihab": "#DB4621",
//     "Sham": "#539236",
//     "Sicile": "#4B281F",
//     "Sijistan": "#68DA85",
//     "Sind": "#6C7BD8",
//     //"Transoxiana": "#DBB540",
//     "Yemen": "#8F3247",
//     22: "#000000",//"#A8DBD5", has changed to light gray to set this region to background
//     "Badiyat al-Arab": "#d3d3d3",//"#C9DB3F", has changed to light gray to set this region to background
//     "Jazirat al-Arab": "#537195",
//     "NoRegion": "#d3d3d3", //# "#7E5C31", for routepoints clearly between regions
//     26: "#D1785F",
//     27: "#898837",
//     28: "#DC4AD3",
//     29: "#DD454F",
//     30: "#C4D9A5",
//     31: "#DDC1BF",
//     32: "#D498D2",
//     33: "#61B7D6",
//     34: "#A357B1",
//     "Transoxiana": "#522046",
//     36: "#849389",
//     //"Transoxiana": "#3B524B",
//     38: "#DD6F91",
//     39: "#B4368A",
//     "Andalus": "#8F547C"
// };

// Types of the toponyms to be shown on map
var type_size =
{
    "metropoles" : 5,
    "capitals" : 4,
    "towns" : 3,
    "villages" : 2,
    "waystations" : 1,
    "sites" : 1,
    "xroads" : 1,
    "waters" : 0.5,
    "mont" : 0.5
};

/* Earlier version
 {
 "metropoles" : 5.2,
 "capitals" : 4.3,
 "towns" : 2.3,
 "villages" : 1.3,
 "waystations" : 1,
 "xroads" : 0.7
 };
 */

var graph;
//var DAY = 120000;
var DAY = 39702;
var WITHIN_A_DAY = DAY * 3;
//var MULTIPLIER = 3;
var NUM_ZONES = 5;

/* Configuration settings auto-generated from YAML settings file,
   used by James Baillie's dynamic route weight calculations
   (see graph.js)

   @@TODO:
   Rather than putting this in the code here, in the longer term it should be picked
   up dynamically by the Al Thurayya application...  this could be by a separate
   script include in the index.html file, or by regenerating the data as JSON and 
   reading it into memory inm (say) index.js.
 */

weweights = [
    ["Meter", "Num", 1, -1, 1],
    ["summer", "Typ", 1, "summer", 1],
    ["winter", "Typ", 1, "winter", 1],
    ["eToponym_type", "Typ", 1, "eToponym_type", 1],
    ["spring", "Typ", 1, "spring", 1],
    ["terrain", "Typ", 1, "terrain", 1],
    ["autumn", "Typ", 1, "autumn", 1],
    ["safety", "Typ", 1, "safety", 1],
    ["sToponym_type", "Typ", 1, "sToponym_type", 1]
    ]

typetranslator =
    { "summer":
        [ ["passable", 1],
          ["impassable", 1000]
        ]
    , "winter":
        [ ["passable", 1],
          ["impassable", 1000]
        ]
    , "eToponym_type":
        [ ["capitals", 3],
          ["waystations", 1],
          ["waters", 1],
          ["villages", 1],
          ["sites", 1],
          ["quarters", 1],
          ["regions", 1],
          ["mont", 1],
          ["xroads", 1],
          ["metropoles", 4],
          ["towns", 2]
        ]
    , "spring":
        [ ["passable", 1],
          ["impassable", 1000]
        ]
    , "terrain":
        [ ["mountain", 1.25],
          ["river", 0.75],
          ["desert", 2],
          ["normal", 1]
        ]
    , "autumn":
        [ ["passable", 1],
          ["impassable", 1000]
        ]
    , "safety":
        [ ["dangerous", 2],
          ["safe", 0.75],
          ["normal", 1]
        ]
    , "sToponym_type":
        [ ["capitals", 3],
          ["waystations", 1],
          ["waters", 1],
          ["villages", 1],
          ["sites", 1],
          ["quarters", 1],
          ["regions", 1],
          ["mont", 1],
          ["xroads", 1],
          ["metropoles", 4],
          ["towns", 2]
        ]
    }

/* End */



