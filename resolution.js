var I = [];        // I is the notation for set of literals either as unit clause or derived after resolutions
var T = [];        // Resultant CNF from setting up literals from I


function unit_propagation(CNF){

	while(CNF.containsUnitClause()){    
	    for(var c in CNF.formula){
		    if(CNF.formula[c].isUnitClause())
			    I.push(CNF.formula[c].literals[0]);		
	    }
	    for(var l in I){
	    	CNF.setLiteral(I[l].name, true);
	    } 
    }
}


// function dpll_propagated(CNF){
// 	unit_propagation(CNF);
// }


var testCNF = new CNF();
var c1 = new Clause();
c1.addLiteral(new Literal('L1', false));
//c1.addLiteral(new Literal('L2', false));
//c1.addLiteral(new Literal('L3', true));

var c2 = new Clause();
c2.addLiteral(new Literal('L1', true));
c2.addLiteral(new Literal('L2', true));
//c2.addLiteral(new Literal('L3', false));

var c3 = new Clause();
c3.addLiteral(new Literal('L4', true));

testCNF.addClause(c1);
testCNF.addClause(c2);
testCNF.addClause(c3);

unit_propagation(testCNF);

console.log(I);