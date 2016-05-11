import { Meteor } from 'meteor/meteor';

import { regression } from"./regression.js";

//External function that handles all the mathematical fitting, and such
//Right now, we log all the patterns it finds
find_patterns = function(canvas) {
  var _lin_col = "rgba(0, 200, 50, .7)"
  var _qua_col = "rgba(0, 200, 200, .7)"
  var _log_col = "rgba(0, 20, 170, .5)"
	var i, j;
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
    //See if it is mostly red
		if (1.5 * r > g + b && r > 80) {
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
		} else {
      //We dim all others just a bit
      data[i + 3] = 0;
    }
	}
	//Line of best fit ax + b = y
  var _data_format = [];
  for (i = 0; i < red_x.length; ++i) {
    _data_format.push([red_x[i], red_y[i]]);
  }
  //var _lin_fit = regression('line', _data_format, 1);
  var _qua_fit = regression('pol', _data_format, 2);
  /*console.log("Linear Fit: ");
  console.log(_lin_fit);*/
  console.log("Quadratic Fit: ");
  console.log(_qua_fit);
  imageData.data = data;

  /*context.beginPath();

  context.lineWidth = 6;
  context.setLineDash([10, 4]);


  context.strokeStyle = _lin_col;

  var x, _ev_l, _ev;
  _ev_l = _lin_fit.equation[0] * (c) + _lin_fit.equation[1];
  for (x = c; x < width; x += c) {
    _ev = _lin_fit.equation[0] * (x + c) + _lin_fit.equation[1];
    context.moveTo(x, _ev_l);
    context.lineTo(x, _ev);
    context.stroke();
    _ev_l = _ev;
  }*/

  var c = 1;


  context.strokeStyle = _lin_col;

  context.beginPath();
  //context.moveTo(0, 0);

  _ev_l = eval_qua(_qua_fit.equation, 0);
  for (var x = c; x < width; x += c) {
    _ev = eval_qua(_qua_fit.equation, x);
    context.moveTo(x, _ev_l);
    context.lineTo(x, _ev);
    context.stroke();
    _ev_l = _ev;
  }

  /*for (x = c; x < width; ++x) {
    _ev = _qua_fit.equation[0] * (x + c) * (x + c) + _qua_fit.equation[1] * (x + c) + _qua_fit.equation[2];
    context.moveTo(x, _ev_l);
    context.lineTo(x, _ev);
    context.stroke();
    _ev_l = _ev;
  }*/

  /*var _fit = regress_leastsquares_linear(red_x, red_y);
  var _fit_log = regress_leastsquares_log(red_x, red_y);
  //We put the altered data back in
  imageData.data = data;
  //We write to the canvas
	context.putImageData(imageData, 0, 0);
  //To draw a line through the image
  context.beginPath();
  //Calculate f(0) and f(max) and draw a line through
  var begin = _fit.a * 0 + _fit.b;
  var end = _fit.a * width + _fit.b;
  context.setLineDash([10, 4]);
  context.strokeStyle = _lin_col;
  //A bit thick
  context.lineWidth = 6;
  //Move it and fill
  context.moveTo(0, begin);
  context.lineTo(width, end);
  context.stroke();
  context.strokeStyle = _log_col;
  context.setLineDash([10, 4]);
  context.beginPath();
  var z = 0;
  var _s, _e;
  var _c = 14;
  _s = _fit_log.a * Math.log(z + 1) + _fit_log.b;
  for (z = _c; z < width; z += _c) {
    _e = _fit_log.a * Math.log(z + _c + 1) + _fit_log.b;
    context.moveTo(z - _c, _s);
    context.lineTo(z, _e);
    context.stroke();
    _s = _fit_log.a * Math.log(z + _c) + _fit_log.b;
  }*/
}

function eval_qua(coef, x) {
  return coef[0] + coef[1] * x + coef[2] * x * x;
}

//Line of best fit, classic method  
function regress_leastsquares_linear(X, Y) {
   	var sum_x = 0;
   	var sum_y = 0;
   	var sum_xy = 0;
   	var sum_x2 = 0;
   	var l = X.length;
   	for (var i = 0; i < l; ++i) {
   		sum_x += X[i];
   		sum_y += Y[i];
   		sum_xy += X[i] * Y[i];
   		sum_x2 += X[i] * X[i];
   	}
   	var _div = (l * sum_x2 - sum_x * sum_x);
   	var a, b = 0;
   	a = (l * sum_xy - sum_x * sum_y) / _div;
   	b = (sum_y * sum_x2 - sum_x * sum_xy) / _div;
    var ss_res = 0;
    var ss_tot = 0;
    var y_m = 0;
    for (var i = 0; i < l; ++i) {
      y_m += Y[i];
    }
    y_m /= l;
    for (var i = 0; i < l; ++i) {
      ss_res += (Y[i] - (a * X[i] + b)) * (Y[i] - (a * X[i] + b));
      ss_tot += (Y[i] - y_m) * (Y[i] - y_m);
    }
   	return {
   		a: a,
   		b: b,
   		r: Math.sqrt(1 - ss_res / ss_tot),
   	};
}


//Line of best fit, logarithmic y ~ aln(X) + b
function regress_leastsquares_log(X, Y) {
    var ln_X = [];
    for (var i = 0; i < X.length; ++i) {
      ln_X.push(Math.log(X[i] + 1));
    }
    return regress_leastsquares_linear(ln_X, Y);
}


/*

Full out regression class I found

*/

/**
* @license
*
* Regression.JS - Regression functions for javascript
* http://tom-alexander.github.com/regression-js/
*
* copyright(c) 2013 Tom Alexander
* Licensed under the MIT license.
*
**/




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
