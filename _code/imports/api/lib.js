import { Meteor } from 'meteor/meteor';

export function find_patterns(pic) {
	var imgData = pic.getImageData(0,0,canvas.width,canvas.height);
	var data = imgData.data;

// enumerate all pixels
// each pixel's r,g,b,a datum are stored in separate sequential array elements

for(var i=0; i<data.length; i+=4) {
  var red = data[i];
  var green = data[i+1];
  var blue = data[i+2];
  var alpha = data[i+3];
}
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

Riemann zeta function. Sum of the recipricols to some power x

*/
//A few chebyshev terms to hel with zeta
var cheb_term;
var cheb_n = 20;

function init_cheb() {
  cheb_term =[];
  for (var i = 0; i <= cheb_n; ++i) {
    var sum = 0;
    var c_n = fac(cheb_n - 1);
    var c_d = fac(cheb_n);
    for (var j = 0; j <= i; ++j) {
        sum += c_n / c_d;
        c_n *= 4 * (cheb_n + j);
        c_d /= (cheb_n - j);
        c_d *= (2 * j + 1) * (2 * j + 2);
    }
    cheb_term.push(sum);
  }
  console.log(cheb_term);
}

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
function gamma(x) {
  if (x <3) {
    return gamma(x + 1) / (x);
  }
  return Math.exp(x * Math.log(x) - x - (Math.log(x  / (2 * pi))) / 2 + 1 / (12 * x) - 1 / (360 * x * x * x) + 1 / (1260 * x * x * x * x * x));
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
