var m = 6              // no. of variables present
var antecedent = new Array(m);
var conflict_clause = -1;
var memo = new Array(m);
var latest_conflict = -1;
var conflict = false;
var dl = 0;        // decision level
var learned_set = [] ;

function resolve(clause1, clause2, literal){
    var finalClause = new Clause();
    for( var l in clause1.literals){
        if(clause1.literals[l].name == literal.name){
            clause1.literals.splice(l, 1);
            break;
        }
    }
    for( var l in clause2.literals){
        if(clause2.literals[l].name == literal.name){
            clause2.literals.splice(l, 1);
            break;
        }
    }
    finalClause.literals =  clause1.literals.concat(clause2.literals);
    var refineClause = [];
    for(var l in finalClause.literals){
        if(refineClause[finalClause.literals[l].name] == true || refineClause[finalClause.literals[l].name] == false ){}
        refineClause[finalClause.literals[l].name] = finalClause.literals[l].isNegate;
    } 
    console.log(refineClause);
    return finalClause;
};

function unit_propagation(CNF){
    
    var I = [];
    while(CNF.containsUnitClause()){ 
        for(var c in CNF.formula){
            if(CNF.formula[c].isSet)
                continue;
            if(CNF.formula[c].isUnitClause()){ 
                I.push(CNF.formula[c].literals[0]);
                CNF.setLiteral(CNF.formula[c].literals[0], true);
                antecedent[CNF.formula[c].literals[0].name - 1] = c ;     
            };
    //        console.log(I.length);
        };
    };    
    //console.log('antecedent: ', antecedent);
    return I;
};

function chooseLiteral(CNF, V){                         // TODO heuristic for best literal
    //console.log(CNF.formula[0].literals[0].name);
    for(var c in CNF.formula){
        if(CNF.formula[c].isSet)
            continue;
        return CNF.formula[c].literals[0];
    }
}

function conflictAnalysis(CNF, V){                      // 1-UIP
    var conflict_set = memo[0][0].formula[conflict_clause];
    console.log('conflict set : ', conflict_set);
    // console.log('dl  : ', dl);
    // console.log('conflict clause : ', conflict_clause);
    var finalClause = JSON.parse(JSON.stringify(conflict_set));
    for(var x in conflict_set.literals){ 
        console.log(conflict_set.literals[x].name);
        //finalClause = resolve(finalClause,CNF.formula[antecedent[conflict_set.literals[x].name - 1]],conflict_set.literals[x].name);
        if(UIP(finalClause)) break;
    }
    // for(var x in conflict_set.literals){
    //     conflict_set.literals[0].isNegate = !conflict_set.literals[0].isNegate;
    // }
    learned_set = finalClause;
    // var b = secondHighestDecisionLevel(finalClause) ; 
    // return b;
    return dl-1 ;
}

function Backtract(CNF, V, b){
    CNF = memo[b][0];
    V = memo[b][1];
    CNF.addClause(learned_set);
}

function cdcl(CNF, V){
    var I = unit_propagation(CNF);
	if(CNF.isEmpty())
		return I;
    else if(CNF.containsEmpty())
    	return -1;
    for(var l in I){
        V[I[l].name - 1] = [ I[l].isNegate ? false : true, dl ];        
    };
    //console.log(V);
    //console.log(V[0]);
    while(V.length != m){
    	var l = chooseLiteral(CNF);
        console.log('lit');
        var newCNF = JSON.parse(JSON.stringify(CNF));
        var assignment = V.slice() ; 
        memo[dl] = [newCNF, assignment] ;
        dl = dl + 1;
        V[l.name - 1] = [l.isNegate ? false : true, dl];
        CNF.setLiteral(l,true);
        I = unit_propagation(CNF);
        
        for(var x in CNF.formula){
            if (CNF.formula[x].isEmpty()){
                conflict = true;
                conflict_clause = x;
                break;
            };
        };
        
        for(var l in I){
            V[I[l].name - 1] = [ I[l].isNegate ? false : true, dl ];       
        };

        if (conflict) {
            //console.log('Check: ', dl);
            var b = conflictAnalysis(CNF, V);

            if(b < 0)
                return -1;
            else {
                Backtract(CNF, V, b);
                dl = b;
            };
        };
    }
    return V;
  };

var testCNF = new CNF();
var c1 = new Clause(false);
c1.addLiteral(new Literal('1', false));
c1.addLiteral(new Literal('3', true));

var c2 = new Clause(false);
c2.addLiteral(new Literal('1', true));
c2.addLiteral(new Literal('2', false));
c2.addLiteral(new Literal('3', false));
    
var c3 = new Clause(false);
c3.addLiteral(new Literal('2', true));
c3.addLiteral(new Literal('1', true));

var c4 = new Clause(false);
c4.addLiteral(new Literal('1', true));
c4.addLiteral(new Literal('3', true));

var c5 = new Clause(false);
c5.addLiteral(new Literal('4', true));


testCNF.addClause(c1);
testCNF.addClause(c3);
testCNF.addClause(c2);
testCNF.addClause(c4);
testCNF.addClause(c5);

//var I = unit_propagation(testCNF);
// var ans = cdcl(testCNF, []);
// if(ans == -1) console.log('unsatisiable');

// else {
//     for(var i in ans){
//         console.log('Set ',ans[i].name, ' as', !ans[i].isNegate);
//     };
// };
var ans = resolve(c2,c3,new Literal('2', false));