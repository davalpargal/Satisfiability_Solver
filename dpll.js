var n = 3; // no of literals
var m = 2; // no of clauses
function dpll(CNF, d){
  if (d > n) return -1;
  if (CNF.isEmpty()) {
      return [];
  } else if (CNF.containsEmpty()) {
      return -1;
  } else {
     var newCNF = Object.assign({}, CNF);
     newCNF.setLiteral('L' + d, true);
     /*for (var f in newCNF.formula) {
	for(var l in newCNF.formula[f].literals) {
		console.log(newCNF.formula[f].literals[l]);
	}
	console.log('new clause');
     }*/
     var L = dpll(newCNF, d + 1);
     if (L != -1) {
        L.push('L' + d);
	return L;
     }
     newCNF = Object.assign({}, CNF);
     newCNF.setLiteral('L' + d, false);
     L = dpll(newCNF, d + 1);
     if (L != -1) {
        L.push('~L' + d);
	return L;
     }
     return -1;
  }
}

var testCNF = new CNF();
var c1 = new Clause();
c1.addLiteral(new Literal('L1', false));
c1.addLiteral(new Literal('L2', false));
c1.addLiteral(new Literal('L3', true));

var c2 = new Clause();
c2.addLiteral(new Literal('L1', true));
c2.addLiteral(new Literal('L2', true));
c2.addLiteral(new Literal('L3', false));

testCNF.addClause(c1);
testCNF.addClause(c2);

var ans = dpll(testCNF, 1);
if (ans == -1) ans = 'Unsatisfiable';
console.log(ans);
