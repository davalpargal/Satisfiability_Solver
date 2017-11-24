var T = [];        // Resultant CNF from setting up literals from I

function unit_propagation(CNF, I){
    // console.log('CNF : ', CNF.formula[0].literals);
	while(CNF.containsUnitClause()){  
	    for(var c in CNF.formula){
            if(CNF.formula[c].isSet)
                continue;
		    if(CNF.formula[c].isUnitClause())
			    I.push(CNF.formula[c].literals[0]);		
	    }
	    for(var l in I){
	    	CNF.setLiteral(I[l], true);
	    } 
    }
};

function chooseLiteral(CNF){
    // console.log(CNF.formula[0].literals[0].name);
	for(var c in CNF.formula){
        if(CNF.formula[c].isSet)
            continue;
        return CNF.formula[c].literals[0];
    }
}

function dpll_propagated(CNF){
	var I = [];        // I is the notation for set of literals either as unit clause or derived after resolutions
    unit_propagation(CNF,I);
    // console.log('here : ',I);
	if(CNF.isEmpty())
		return I;
    else if(CNF.containsEmpty())
    	return -1;
    else{
    	var l = chooseLiteral(CNF);
        var newCNF = Object.assign({}, CNF);
        newCNF.setLiteral(l, true);
        var L = dpll_propagated(CNF);
        if(L != -1){
        	L = I.concat(L);
            L.push(l);
            return L;
        }
        newCNF = Object.assign({}, CNF);
        newCNF.setLiteral(l, false);
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
var c1 = new Clause(false);
c1.addLiteral(new Literal('1', false));
c1.addLiteral(new Literal('4', false));
c1.addLiteral(new Literal('3', true));

var c2 = new Clause(false);
c2.addLiteral(new Literal('1', false));
c2.addLiteral(new Literal('2', true));
c2.addLiteral(new Literal('3', false));
    
var c3 = new Clause(false);
c3.addLiteral(new Literal('1', true));

testCNF.addClause(c1);
testCNF.addClause(c2);
testCNF.addClause(c3);
//unit_propagation(testCNF);
var ans = dpll_propagated(testCNF);
if(ans == -1) console.log('unsatisiable');

else {
    for(var i in ans){
        console.log('Set ',ans[i].name, ' as', !ans[i].isNegate);
    }
}