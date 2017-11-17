var I = [];        // I is the notation for set of literals either as unit clause or derived after resolutions
var T = [];        // Resultant CNF from setting up literals from I


function unit_propagation(CNF){

	while(CNF.containsUnitClause()){   
	    for(var c in CNF.formula){
		    if(CNF.formula[c].isUnitClause())
			    I.push(CNF.formula[c].literals[0]);		
	    }
	    for(var l in I){
	    	var value = I[l].isNegate ? false : true;
	    	CNF.setLiteral(I[l].name, value);
	    } 
    }
};

function chooseLiteral(CNF){
    //console.log(CNF.formula[0].literals[0].name);
	return CNF.formula[0].literals[0];
}

function dpll_propagated(CNF){
	unit_propagation(CNF);
	if(CNF.isEmpty())
		return I;
    else if(CNF.containsEmpty())
    	return -1;
    else{
    	var l = chooseLiteral(CNF);
        var newCNF = Object.assign({}, CNF);
        newCNF.setLiteral(l.name, true);
        var L = dpll_propagated(CNF);
        if(L != -1){
        	L = I.concat(L);
            L.push(l);
            return L;
        }
        newCNF = Object.assign({}, CNF);
        newCNF.setLiteral(l.name, false);
        L = dpll_propagated(newCNF);
        if(L != -1){
        	L = I.concat(L);
        	l.isNegate = !l.isNegate;
            L.push(l);
            return L;
        }
        return -1;
    }

}


var testCNF = new CNF();
var c1 = new Clause();
c1.addLiteral(new Literal('L1', false));
c1.addLiteral(new Literal('L4', false));
c1.addLiteral(new Literal('L3', true));

var c2 = new Clause();
c2.addLiteral(new Literal('L1', false));
c2.addLiteral(new Literal('L2', true));
c2.addLiteral(new Literal('L3', false));

var c3 = new Clause();
c3.addLiteral(new Literal('L1', true));

testCNF.addClause(c1);
testCNF.addClause(c2);
//testCNF.addClause(c3);
//unit_propagation(testCNF);
var ans = dpll_propagated(testCNF);
if(ans == -1) console.log('unsatisiable');

else console.log('ans is: ',ans);