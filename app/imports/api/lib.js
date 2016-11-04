import { Meteor } from 'meteor/meteor';

import { regression } from"./regression.js";

//External function that handles all the mathematical fitting, and such
//Right now, we log all the patterns it finds
find_patterns = function(canvas, _color, _slop) {
  if (_slop == null) {
    _slop = 20;
  }
  var i, j;
  var arr_color = [];
  for (i = 0; i < 3; ++i) {
      arr_color.push(parseInt(_color.substring(2 * i + 1, 2 * i + 3), 16));
  }
  console.log(arr_color);
  var _pol_col = [0, 20, 100, .1];
  //Ge context from canvas
	var context = canvas.getContext('2d');
  //Get the raw data to search
	var imageData = context.getImageData(0, 0, width, height);
  //Actual stream
  var data = imageData.data;
  //Arrays for red pixels (x, y)
  var red_x = [];
  var red_y = [];

  //How many to to run through? Only check every nth pixel
  var _skip = 1;

  //Loop through
	for (i = 0; i < data.length; i += 4) { //RGBA format R, G, B, A, R, G, B, A, so we have to skip

    //Pixel arra if it were not in multiples of four
		var _pix = Math.floor(i / 4);
    //Read in varaibles 
		var r = data[i];
		var g = data[i+1];
		var b = data[i+2];
    var _cur_color = [r, g, b];
    //See if it is mostly red

		if (is_close_color(arr_color, _cur_color, _slop)) {
			var _x = Math.floor(_pix % width);
			var _y = Math.floor(_pix / width);
      //By default, we want to create a new point in the arrays, but we should take the highest value
			var do_push = 1;
      //We dont have to check Y's because the img is stored as:
      /*
      0, 1, 2, 3, 4, ...
      800, 801, 802, ...
      1600, 1601, ...
      2400, ...
      . ...
      .
      .
      */
			for (j = 0; j < red_x.length; ++j) {
        //If we find an x has already been associated with a y
        if (red_x[j] == _x) {
          do_push = 0;
          break;
        }
			}
      //If we still need to create a new listing
			if (do_push == 1) {
				red_x.push(_x);
				red_y.push(_y);
			}
      continue;
		} else {
      data[i + 3] = 200;
    }
	}
	//Line of best fit ax + b = y
  var _data_format = [];
  for (i = 0; i < red_x.length; ++i) {
    _data_format.push([red_x[i], red_y[i]]);
  }

  imageData.data = data;

  context.putImageData(imageData, 0, 0);


  var _pol_fit = [];
  var _todo = [1, 3];
  for (i = 0; i < _todo.length; ++i) {
    _pol_fit.push(regression('pol', _data_format, _todo[i]));
  }
  console.log("Polynomial Fits: ");
  console.log(_pol_fit);

  context.lineWidth = 6;

  var x;

  for(i = 0; i < _todo.length; ++i) {
    _pol_col[0] = 35;
    _pol_col[1] = 215 - 60 * i;
    _pol_col[2] = 255 - _pol_col[1];
    _pol_col[3] = i * .6 / _todo.length + .2;
    context.strokeStyle = "rgba(" + _pol_col[0] + ", " + _pol_col[1] + ", " + _pol_col[2] + ", " + _pol_col[3] + ")";
    context.beginPath();
    _ev_l = eval_pol(_pol_fit[i].equation, 0);
    for (x = 1; x < width; ++x) {
      _ev = eval_pol(_pol_fit[i].equation, x);
      context.moveTo(x - 1, _ev_l);
      context.lineTo(x, _ev);
      context.stroke();
      _ev_l = _ev;
    }
  }
  var coords = getCoords();
  console.log(coords);
  var transformed_pol = tranform_pol(_data_format, coords.xmin, coords.xmax, coords.ymin, coords.ymax);
  console.log(transformed_pol);
  document.getElementById("equation").value = pol_string(transformed_pol.equation);
}

function pol_string(_pol) {
  var pol = _pol;
  for (var j = 0; j < pol.length; ++j) {
     pol[j] = pol[j].toFixed(2);
  }
  var res = "";
  for (var i = pol.length - 1; i >= 2; --i) {
    var c = pol[i];
    var term = "";
    if (c > 0) {
      if (i == pol.length - 1) {
        term = c + "x^" + i;
      } else {
        term = "+" + c + "x^" + i;
      }
    } else if (c < 0) {
      term = "-" + -c + "x^" + i;
    }
    res = res + term;
  }
  if (pol[1] > 0) {
    res = res + "+" + pol[1] + "x"
  } else if (pol[1] < 0) {
    res = res + "-" + -pol[1] + "x"
  }
  if (pol[0] > 0) {
    res = res + "+" + pol[0]
  } else if (pol[0] < 0) {
    res = res + "-" + -pol[0]
  }
  return res;
}


function is_close_color(rbga, color, slop) {
  var i;
  for (i = 0; i < 3; ++i) {
    if (!(Math.abs(rbga[i] - color[i]) <= slop)) {
      return false;
    }
  }
  return true;
}

//Returns polynomial that is tranformed from pixel coords into raw x and y (supplied by user)
function tranform_pol(_data_format, xmin = 0, xmax = 1, ymin = 0, ymax = 1, degree = 3) {
  var x_c = [xmin, (xmax - xmin) / width];
  var y_c = [ymin, (ymax - ymin) / height];
  for (var i = 0; i < _data_format.length; ++i) {
    _data_format[i] = [x_c[1] * _data_format[i][0] + x_c[0], ymax - (y_c[1] * _data_format[i][1] + y_c[0])];
  }
  return regression('pol', _data_format);
}

function add_pol(p1, p2) {
  var max = Math.min(p1.length, p2.length);
  var ret = [];
  ret.length = Math.max(p1.length, p2.length);
  for (var i = 0; i < max; ++i) {
    ret[i] = p1[i] + p2[i];
  }
  if (p1.length > p2.length) {
    for (var j = p2.length; j < p1.length; ++j) {
      ret[j] = p1[j];
    }
  } else if (p2.length > p1.length) {
    for (var k = p1.length; k < p2.length; ++k) {
      ret[k] = p2[k];
    }
  }
  return ret;
}


function scale_pol(pol, a) {
  var scaled = pol;
  for (var i = 0; i < pol.length; ++i) {
    scaled[i] *= a;
  }
  return scaled;
}

//Evaluates polynomial
function eval_pol(coef, x) {
  var sum = 0;
  var x_i = 1;
  var i;
  for (i = 0; i < coef.length; ++i) {
      sum += x_i * coef[i];
      x_i *= x;
  }
  return sum;
}

function getCoords() {
  var inp = document.getElementById("coords").value;
  if (!inp) {
    inp = "(0,0);(1,1)"
  }
  inp = inp.replace(/ /g, "");
  inp = inp.replace(/\(/g, "")
  inp = inp.replace(/\)/g, "")
  var point = inp.split(";");
  point[0] = point[0].split(",");
  point[1] = point[1].split(",");
  var ret = {};
  ret.xmin = parseFloat(point[0][0]);
  ret.ymin = parseFloat(point[0][1]);
  ret.xmax = parseFloat(point[1][0]);
  console.log(point[1]);
  ret.ymax = parseFloat(point[1][1]);
  return ret;
}


/*

Functions class. Implements basic functions as well as some lesser known ones, and am going to interpolate it

*/

function erf(x) {
  var t = 1 / (1 + .471 * x);
  return 1 - (.348 * t - .096 * t * t + .75 * t * t * t) * Math.exp(- x * x);
}


function sin(x) {
  return Math.sin(x);
}

function cos(x) {
  return Math.cos(x);
}

function sqrt(x) {
  return Math.sqrt(x);
}


/*

Riemann zeta function. Sum of the recipricols to some power x, eg
1^x + 2^x + 3^x + 4^x + ...

*/
//A few chebyshev terms to help with zeta approximation
var cheb_term = [0.05, 40.05, 5360.05, 286256.05, 8131280.050000001, 142019689.65, 1663478889.65, 13835152489.65, 85039443049.65, 397779856489.6499, 1447929244777.65, 
4175589993577.6494, 9690208463977.648, 18377853561961.65, 28996086459497.65, 38955256625462.445, 45982896863542.445, 49590669392182.445, 50861979711798.445, 51136857618742.445, 51164345409436.84];
var cheb_n = 20;


function zeta(x) {
  if (x < 0) {
    var ze_ref = zeta(1 - x);
    var c_xp = Math.sin(pi * x / 2);
    var g_ref = gamma(1 - x);
    var tpi_tx = Math.pow(2, x) * Math.pow(pi, x - 1);
    return ze_ref * g_ref * c_xp * tpi_tx;
  }
  var sum = 0;
  var sign = 1;
  var _c = 1 - Math.pow(2, 1 - x);
  for (var i = 0; i <= cheb_n - 1; ++i) {
    sum += sign * (cheb_term[i] - cheb_term[cheb_n]) / (Math.pow(i + 1, x));
    sign *= -1;
  }
  sum /= (- cheb_term[cheb_n] * _c);
  return sum;
}

/*

Euler's gamma function. gamma(x) = (x-1)!

*/
function gamma(i) {
  if (i <3 /* you */) {
    return gamma(i + 1) / (i);
  }
  return Math.exp(i * Math.log(i) - i - (Math.log(i  / (2 * pi))) / 2 + 1 / (12 * i) - 1 / (360 * i * i * i) + 1 / (1260 * i * i * i * i * i));
}


/*

Floor function

*/
function floor(x) {
  return Math.floor(x);
}


/*

Greatest common denominator

*/
function gcd(a, b) {
   if ( ! b) {
        return a;
    }
    return gcd(b, a % b);
}

/*

e^x

*/
function exp(x) {
  return Math.exp(x);
}

/*

a^b

*/
function pow(a, b) {
  return Math.pow(a, b);
}


/*

sqrt(x) ^ 2 = x

*/
function sqrt(x) {
  return Math.sqrt(x);
}


/*

Log of x

*/
function log(x) {
  return Math.log(x); 
}

/*

factorial of floor(x)

*/
function fac(x) {
  var pr = 1;
  for (var i = 1; i <= x; ++i) {
    pr *= i;
  }
  return pr;
}

/*

Product function.

*/
function prod_p1(x) {
  var p = 1;
  var x_i = x;
  for (var i = 1; i < 1000; ++i) {
    if (x_i >= 10000000000) {
      break;
    }
    p *= (x_i) / (x_i - 1);
    x_i *= x;
  }
  return p;
}


/*

Dragon geometric.
Custom function

*/
function dragon_geometric(x) {
  var sum = 0;
  for (var i = 1; i < 1000; ++i) {  
    sum += pow(-1, i) * pow(i, x - i);
  }
  return sum;
}


/*

Returns 1 if prime

*/
function isprime(z) {
  if (z == 0 || z == 1) {
    return 0;
  }
  if (z == 2) {
    return 1;
  }
  if (z % 2 == 0) {
    return 0;
  }
  for (var c = 3; c < Math.sqrt(z); c += 2) { 
    if (z % c == 0) {
      return 0;
    }
  }
  return 1;
}

function integral(f, lim) {
  var sum = 0;
  var x;
  for (x = 0; x <= lim; x += .01) {
    sum += .01 * eval(f);
  }
  return sum;
}

function integral_b(f, lim) {
  var sum = 0;
  var x;
  for (x = lim[0]; x <= lim[1]; x += .01) {
    sum += .01 * eval(f);
  }
  return sum;
}
