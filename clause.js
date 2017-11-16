var Literal = function(name,isNegate) {
    this.name = name;
    this.isNegate = isNegate;
};

var Clause = function() {
    this.literals = [];
    var scope = this;
    this.addLiteral = function(literal){
      scope.literals.push(literal);
        };
    this.isEmpty = function(){
       return scope.literals.length == 0 ;
    };
};

var CNF = function() {
    this.formula = [] ;
    var scope = this;
    this.addClause = function(clause){
        scope.formula.push(clause);
        };
    this.isEmpty = function(){
       return scope.formula.length == 0;
    };
    this.containsEmpty = function(){
      for(var x in scope.formula){
         if (scope.formula[x].isEmpty())
             return true;
      }
      return false;
    };
    this.setLiteral = function(literalName, value) {
	var spliceList = [];
        for(var f in scope.formula) {
            for(var l in scope.formula[f].literals ) {
                var literal = scope.formula[f].literals[l];
                if(literal.name == literalName) {
                    var literalValue = literal.isNegate ? !value : value;
//		    console.log('[clause]> ' + literalName + ' = ' + literalValue);
                    if (literalValue) {
			spliceList.push(f);
                        break;
                    } else {
                        scope.formula[f].literals.splice(l, 1);
                    }
                }
            }
        }
	spliceList.sort(function(a, b) {
		return b - a;
	});
	for (var i in spliceList)
		scope.formula.splice(spliceList[i], 1);
    };
};
