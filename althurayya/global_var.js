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


// Set starting zoom
var min_zoom = 12, // 5
    max_zoom = 14;
	
// Set starting lat & long
var init_lat = -27.126, init_lon = -109.277;

////
//Simple variable model
////
// Order must be same as in JSON
//
//
weweights = [
["Meter","Num",1,-1],
["Moai","InvNum",1,-1],
["Type","Typ",1,0],
["Summer","Num",0,-1],
["Winter","Num",0,-1]
]

typetranslator = [
 [["Water", 0.6],["Land", 1],["Hilly",2]],
 ]

 
 
 
 
////
//JMB Multifactor model
////
use_multifactor = 0
//Set state variables
//These change the state of either the world or journey. They CAN be set by the user
state_types = [
1,//Speed of transportation type, lower is faster, 1 is slowest
1 //Season, 0= winter, 1=not-winter
]

//Set weight types & values
//Any weight should be between 0 and 1
//Add up and divide by n(weights) at the end: this is how you can weight weight types
//Weights have a name[0], type[1], state variable OR weight link[2], weight-weight[3], magnitude[4]
weight_types = [
["MeterDist", 4, 0, 1, -1],
["Moai", 1, -1, 1, -1],
["WaterRoute", 5, 0, -1, 0.2],
["Seasonality", 3, 1, -1, -1]
]
//NOTES ON TYPE OPTIONS
//Type options are a multiplier (1), 
// (1) A factor simply boosts or cuts down an edge. Its value is a magnitude. It does NOT have a linked state variable. Its value should be from 0 to 1.
// (2) A multiplier boosts or cuts down a factor or interactor. Its value is a magnitude. It does NOT have a linked state variable. Its value can be anything positive.
// (3) A switch turns an edge on or off in combination with a state variable. Its value is either 0 or 1.
// (4) An interactor is a factor that affects an edge in combination with a state variable. Its value is a magnitude. Its value should be from 0 to 1.
// (5) A choke switches off or makes static a state variable that would normally affect the route. This allows for e.g. a static speed for water travel. Its value is either 0 or 1.