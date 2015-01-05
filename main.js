/*
corners  _.-'-._                 edges    _.-'-._
     _.-'-._3_.-'-._                  _.-'-._ _.-'-._
 _.-'-._ _.-'-._ _.-'-._          _.-'-._1_.-'-._3_.-'-._
|-._ _.-'-._U_.-'-._ _.-|        |-._ _.-'-._U_.-'-._ _.-|
| 1 |-._ _.-'-._ _.-| 2 |        |   |-._ _.-'-._ _.-|   |
|-._|   |-._ _.-|   |_.-|        |-._| 0 |-._ _.-| 2 |_.-|
|   |-._|   0   |_.-|   |        | 9 |-._|   |   |_.-| 10|
|-._| F |-._|_.-| R |_.-|        |-._| F |-._|_.-| R |_.-|
| 5 |-._|   |   |_.-| 6 |   5--> |   |-._|  8|   |_.-|   | <--7
'-._|   |-._|_.-|   |_.-'        '-._| 4 |-._|_.-| 6 |_.-'
    '-._|   |   |_.-'                '-._|   |   |_.-'
        '-._4_.-'                        '-._|_.-'

U       F        R       L       B       D
up    front    right    left    back    down
*/

var layers = {
	u: {corners: [0, 1, 3, 2], edges: [0, 1, 3, 2]},
	f: {corners: [1, 0, 4, 5], edges: [0, 8, 4, 9]},
	r: {corners: [0, 2, 6, 4], edges: [6, 8, 2, 10]},
	l: {corners: [3, 1, 5, 7], edges: [1, 9, 5, 11]},
	b: {corners: [2, 3, 7, 6], edges: [3, 11, 7, 10]},
	d: {corners: [4, 6, 7, 5], edges: [4, 6, 7, 5]}
};

function move(turn) {
	var side = turn[0];
	var layer = layers[side];
	var m = document.querySelector('.cubie-middle-' + side);
	var cubies = [m.parentNode];
	for(var i=0; i<layer.corners.length; ++i) {
		var c = document.querySelector('.cubie-corner-position-' + layer.corners[i]);
		cubies.push(c.parentNode);
	}
	for(var i=0; i<layer.edges.length; ++i) {
		var e = document.querySelector('.cubie-edge-position-' + layer.edges[i]);
		cubies.push(e.parentNode);
	}
	for(var i=0; i<cubies.length; ++i) {
		cubies[i].classList.add('turn');
		cubies[i].classList.add('turn-' + turn);
	}
}

function updateCubie() {
	var match = this.className.match(/turn\-(..)/);
	this.classList.remove('turn');
	this.classList.remove(match[0]);
	
	var step = +match[1][1];
	var side = match[1][0];
	var layer = layers[side];
	var div = this.children[0];
	
	var re = /(cubie-corner-position-)(\d+)/;
	if(match = div.className.match(re)) {
		var idx = layer.corners.indexOf(+match[2]);
		var newVal = layer.corners[(idx + step)&3];
		div.className = div.className.replace(re, '$1' + newVal);
		
		div = div.children[0];
		re = /(cubie-corner-orientation-)(\d+)/;
		match = div.className.match(re);
		newVal = (+match[2] + (side!='u' && side!='d') * (step&1) * (1+(idx&1))) % 3;
		div.className = div.className.replace(re, '$1' + newVal);
	}
	
	re = /(cubie-edge-position-)(\d+)/;
	if(match = div.className.match(re)) {
		var idx = layer.edges.indexOf(+match[2]);
		var newVal = layer.edges[(idx + step)&3];
		div.className = div.className.replace(re, '$1' + newVal);
		
		div = div.children[0];
		re = /(cubie-edge-orientation-)(\d+)/;
		match = div.className.match(re);
		newVal = +match[2]^(side=='f' || side=='b')&step;
		div.className = div.className.replace(re, '$1' + newVal);
	}
}
var stopMove = false;
var nextMove = function() {
	var prevSide = '';
	var sides = ['u','f','r','l','b','d'];
	return function() {
		if(stopMove) return;
		if(document.querySelector('.cube-layer.turn')) return;
		var side = prevSide;
		while(side == prevSide) side = sides[Math.random()*6|0];
		var step = 1 + (Math.random()*3|0);
		setTimeout(function() {move(side+step)}, 10);
		prevSide = side;
	};
}();

var layerDivs = document.querySelectorAll('.cube-layer');
for(var i=0; i<layerDivs.length; ++i) {
	layerDivs[i].addEventListener('transitionend', updateCubie, true);
	layerDivs[i].addEventListener('transitionend', nextMove, true);
}

nextMove();
