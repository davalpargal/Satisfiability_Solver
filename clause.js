var Literal = function(name,isNegate) {
    this.name = name;
    this.isNegate = isNegate;
};

var Clause = function(set) {
    this.literals = [];
    this.isSet = set;
    var scope = this;
    this.addLiteral = function(literal){
      scope.literals.push(literal);
        };
    this.isEmpty = function(){
       return scope.literals.length == 0 ;
    };
    this.isUnitClause = function(){
       return scope.literals.length == 1 ;
    };
};

var CNF = function() {
    this.formula = [] ;
    var scope = this;
    this.addClause = function(clause){
        scope.formula.push(clause);
        };
    this.isEmpty = function(){
        for (var c in scope.formula ) {
            if(!scope.formula[c].isSet)
            return false;      
        };
        return true;
    };
    this.containsEmpty = function(){
        for(var x in scope.formula){
            if (scope.formula[x].isEmpty())
                return true;
        }
        return false;
    };
    this.containsUnitClause = function(){
        for(var x in scope.formula){
            if(scope.formula[x].isSet)
                continue;
            if (scope.formula[x].isUnitClause())
                return true;
        }
        return false;        
    };
    this.setLiteral = function(targetLiteral, value) {
        value = targetLiteral.isNegate ? !value : value;
        for(var f in scope.formula) {
            if(scope.formula[f].isSet)
                continue;
            for(var l in scope.formula[f].literals ) {
                var literal = scope.formula[f].literals[l];
                if(literal.name == targetLiteral.name) {
                    var literalValue = literal.isNegate ? !value : value;
//		            console.log('[clause]> ' + literalName + ' = ' + literalValue);
                    if (literalValue) {
	 		            scope.formula[f].isSet = true;
                        break;
                    } else {
                        scope.formula[f].literals.splice(l, 1);
                    }
                }
            }
        }
	    // spliceList.sort(function(a, b) {
		   //  return b - a;
	    // });
	    // for (var i in spliceList)
		   // scope.formula.splice(spliceList[i], 1);
    };
};
