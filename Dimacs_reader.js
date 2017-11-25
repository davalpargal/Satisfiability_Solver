//var cnf = new CNF();
function printCNF(cnf) {
	for (var f in cnf.formula) {
		var x = '';
		for (var l in cnf.formula[f].literals) {
			var L = cnf.formula[f].literals[l];
			var tmp = L.isNegate ? '~' : '';
			if (l != 0) x = x + ', ';
			x = x + tmp + L.name;
		}
		console.log('{ ' + x + ' }');
	}
}

function readCNF(input) {
    const file = input.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const file = event.target.result;
        const allLines = file.split(/\r\n|\n/);
		
        // Reading line by line
		var nLiteral = 0;
		var nClauses = 0;
		var cnf = new CNF();
        for (var li in allLines) {
            //console.log(allLines[li]);
			if (allLines[li].indexOf('%') !== -1) break;
			if (allLines[li][0] != 'c') {
				var i, si, ei;
				if (allLines[li][0] == 'p') {
					i = 0;
					while(allLines[li][i] < '0' || allLines[li][i] > '9') i++;
					si = i;
					while(allLines[li][i] >= '0' && allLines[li][i] <= '9') i++;
					ei = i;
					
					nLiteral = parseInt(allLines[li].slice(si, ei));
					
					while(allLines[li][i] < '0' || allLines[li][i] > '9') i++;
					si = i;
					while(allLines[li][i] >= '0' && allLines[li][i] <= '9') i++;
					ei = i;
					
					nClauses = parseInt(allLines[li].slice(si, ei));
					
					//console.log('Literals', nLiteral);
					//console.log('Clauses', nClauses);
				}
				else {
					var saveLiterals = 0;
					i = 0;
					while(allLines[li][i] != '-' && (allLines[li][i] < '0' || allLines[li][i] > '9')) i++;
					si = i;
					while(allLines[li][i] == '-' || (allLines[li][i] >= '0' && allLines[li][i] <= '9')) i++;
					ei = i;
					
					var name = parseInt(allLines[li].slice(si, ei));
					if (name != 0 && !isNaN(name)) saveLiterals++;
					var isNegate = name < 0;
					if (isNegate) name = -name;
					var L1 = new Literal(name, isNegate);
					
					while(allLines[li][i] != '-' && (allLines[li][i] < '0' || allLines[li][i] > '9')) i++;
					si = i;
					while(allLines[li][i] == '-' || (allLines[li][i] >= '0' && allLines[li][i] <= '9')) i++;
					ei = i;
					
					name = parseInt(allLines[li].slice(si, ei));
					if (name != 0 && !isNaN(name)) saveLiterals++;
					isNegate = name < 0;
					if (isNegate) name = -name;
					var L2 = new Literal(name, isNegate);
					
					while(allLines[li][i] != '-' && (allLines[li][i] < '0' || allLines[li][i] > '9')) i++;
					si = i;
					while(allLines[li][i] == '-' || (allLines[li][i] >= '0' && allLines[li][i] <= '9')) i++;
					ei = i;
					
					name = parseInt(allLines[li].slice(si, ei));
					if (name != 0 && !isNaN(name)) saveLiterals++;
					isNegate = name < 0;
					if (isNegate) name = -name;
					var L3 = new Literal(name, isNegate);
					
					var C = new Clause(false);
					if (saveLiterals >= 1) C.addLiteral(L1);
					if (saveLiterals >= 2) C.addLiteral(L2);
					if (saveLiterals >= 3) C.addLiteral(L3);
					
					if (saveLiterals > 0) cnf.addClause(C);			
					/*var x1 = L1.isNegate ? '~' : '';
					x1 = x1 + L1.name;
					var x2 = L2.isNegate ? '~' : '';
					x2 = ', ' + x2 + L2.name;
					if (saveLiterals < 2)  x2 = '';
					var x3 = L3.isNegate ? '~' : '';
					x3 = ', ' + x3 + L3.name;
					if (saveLiterals < 3)  x3 = '';
					console.log('{ ' + x1 + x2 + x3 + ' }');*/
				}
			}
        }
		//printCNF(cnf);
		console.time('dpll_propagated');
		var ans = dpll_propagated(cnf);
		console.timeEnd('dpll_propagated');
		if(ans == -1) console.log('unsatisfiable');
		else {
			// for(var i in ans){
			// 	console.log('Set ',ans[i].name, ' as', !ans[i].isNegate);
			// }
			console.log('Satisfiable!!')
		}
		//printCNF(cnf);
    };

    reader.onerror = (evt) => {
        alert(evt.target.error.name);
    };

    reader.readAsText(file);
}