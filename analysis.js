var fs = require('fs')
var path = require('path')
var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");
var mem=0;

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["/home/vagrant/checkBoxCode/server-side/site/routes/create.js"];
	}
	var filePath = args[0];
	var equalcount=0;
	var notqualcount=0;

	complexity(filePath);

	for( var node in builders )
	{
		var builder = builders[node];
		builder.report();
	}
	console.log(builders);
}



var builders = {};

// Represent a reusable "class" following the Builder pattern.
function FunctionBuilder()
{
	this.StartLine = 0;
	this.FunctionName = "";
	this.methodmax=0;
	this.SimpleCyclomaticComplexity = 1;
	this.MaxConditions      = 0;
	this.report = function()
	{
		// ssss
	}
};

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	this.EqualCount=0;
	this.NotEqualCount=0;
	this.report = function()
	{
		//sss
	}
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;

	// A file level-builder:
	var fileBuilder = new FileBuilder();
	fileBuilder.FileName = filePath;
//	fileBuilder.ImportCount = 0;
	builders[filePath] = fileBuilder;

	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var builder = new FunctionBuilder();
			builder.StartLine= node.loc.start.line;
			builder.FunctionName = functionName(node);
			builder.methodmax    = node.loc.end.line - node.loc.start.line;
			if(builder.methodmax > 10){
				console.log("Long Method" + builder.FunctionName +" "+ builder.methodmax);
				const { exec } = require('child_process');
				exec('touch /home/vagrant/checkBoxErrors');
				//fs.readFileSync('/home/vagrant/checkBoxErrors', 'utf8');
				fs.appendFileSync('/home/vagrant/checkBoxErrors',"\nLong Method" + builder.FunctionName +" "+ builder.methodmax,'utf-8');
			}
			traverseWithParents(node, function (child)
			 {
				 
				 if (child.type=='IfStatement' )
				 {
					var ifbuilder = new FunctionBuilder();
					ifbuilder.StartLine=child.loc.start.line;
					traverseWithParents(child,function(anode){
						if (anode.type=='LogicalExpression' ){
						ifbuilder.SimpleCyclomaticComplexity=ifbuilder.SimpleCyclomaticComplexity+1;
						}
						
					});
					if(builder.MaxConditions<ifbuilder.SimpleCyclomaticComplexity){
					builder.MaxConditions=ifbuilder.SimpleCyclomaticComplexity;}
					}
			});
			builders[builder.FunctionName] = builder;
			console.log("If statements inside "+builder.FunctionName +" "+ builder.MaxConditions);
			const { exec } = require('child_process');
			exec('touch /home/vagrant/checkBoxErrors');
			fs.appendFileSync('/home/vagrant/checkBoxErrors',"\nIf statements inside "+builder.FunctionName +" "+ builder.MaxConditions,'utf-8');
		}
		if(node.type =="BinaryExpression" && node.operator=="!=" ){
			var build = new FunctionBuilder();
			build.StartLine    = node.loc.start.line
			//build.EqualParameterCount++;
			fileBuilder.NotEqualCount++;
			console.log("count of not equal  != @ line "+build.StartLine +" "+ fileBuilder.NotEqualCount);
			const { exec } = require('child_process');
			exec('touch /home/vagrant/checkBoxErrors');
			fs.appendFileSync('/home/vagrant/checkBoxErrors',"\ncount of not equal  != @ line "+build.StartLine +" "+ fileBuilder.NotEqualCount,'utf-8');
			
			
		}	
		
		if(node.type =="BinaryExpression" && node.operator=="==" ){
			var builder = new FunctionBuilder();
			builder.StartLine    = node.loc.start.line
			//builder.EqualParameterCount++;
			fileBuilder.EqualCount++;
			console.log("count of equal == @ line "+builder.StartLine+ " "+ fileBuilder.EqualCount);
			const { exec } = require('child_process');
			exec('touch /home/vagrant/checkBoxErrors');
			fs.appendFileSync('/home/vagrant/checkBoxErrors',"\ncount of equal == @ line "+builder.StartLine+ " "+ fileBuilder.EqualCount,'utf-8');
			
			//equalcount++;
		}		
	});
}



// Helper function for counting children of node.
function childrenLength(node)
{
	var key, child;
	var count = 0;
	for (key in node) 
	{
		if (node.hasOwnProperty(key)) 
		{
			child = node[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				count++;
			}
		}
	}	
	return count;
}


// Helper function for checking if a node is a "decision type node"
function isDecision(node)
{
	if( node.type == 'IfStatement')
	{
		return true;
	}
	return false;
}

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}

// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();

function Crazy (argument) 
{

	var date_bits = element.value.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
	var new_date = null;
	if(date_bits && date_bits.length == 4 && parseInt(date_bits[2]) > 0 && parseInt(date_bits[3]) > 0)
    new_date = new Date(parseInt(date_bits[1]), parseInt(date_bits[2]) - 1, parseInt(date_bits[3]));

    var secs = bytes / 3500;

      if ( secs < 59 )
      {
          return secs.toString().split(".")[0] + " seconds";
      }
      else if ( secs > 59 && secs < 3600 )
      {
          var mints = secs / 60;
          var remainder = parseInt(secs.toString().split(".")[0]) -
(parseInt(mints.toString().split(".")[0]) * 60);
          var szmin;
          if ( mints > 1 )
          {
              szmin = "minutes";
          }
          else
          {
              szmin = "minute";
          }
          return mints.toString().split(".")[0] + " " + szmin + " " +
remainder.toString() + " seconds";
      }
      else
      {
          var mints = secs / 60;
          var hours = mints / 60;
          var remainders = parseInt(secs.toString().split(".")[0]) -
(parseInt(mints.toString().split(".")[0]) * 60);
          var remainderm = parseInt(mints.toString().split(".")[0]) -
(parseInt(hours.toString().split(".")[0]) * 60);
          var szmin;
          if ( remainderm > 1 )
          {
              szmin = "minutes";
          }
          else
          {
              szmin = "minute";
          }
          var szhr;
          if ( remainderm > 1 )
          {
              szhr = "hours";
          }
          else
          {
              szhr = "hour";
              for ( i = 0 ; i < cfield.value.length ; i++)
				  {
				    var n = cfield.value.substr(i,1);
				    if ( n != 'a' && n != 'b' && n != 'c' && n != 'd'
				      && n != 'e' && n != 'f' && n != 'g' && n != 'h'
				      && n != 'i' && n != 'j' && n != 'k' && n != 'l'
				      && n != 'm' && n != 'n' && n != 'o' && n != 'p'
				      && n != 'q' && n != 'r' && n != 's' && n != 't'
				      && n != 'u' && n != 'v' && n != 'w' && n != 'x'
				      && n != 'y' && n != 'z'
				      && n != 'A' && n != 'B' && n != 'C' && n != 'D'
				      && n != 'E' && n != 'F' && n != 'G' && n != 'H'
				      && n != 'I' && n != 'J' && n != 'K' && n != 'L'
				      && n != 'M' && n != 'N' &&  n != 'O' && n != 'P'
				      && n != 'Q' && n != 'R' && n != 'S' && n != 'T'
				      && n != 'U' && n != 'V' && n != 'W' && n != 'X'
				      && n != 'Y' && n != 'Z'
				      && n != '0' && n != '1' && n != '2' && n != '3'
				      && n != '4' && n != '5' && n != '6' && n != '7'
				      && n != '8' && n != '9'
				      && n != '_' && n != '@' && n != '-' && n != '.' )
				    {
				      window.alert("Only Alphanumeric are allowed.\nPlease re-enter the value.");
				      cfield.value = '';
				      cfield.focus();
				    }
				    cfield.value =  cfield.value.toUpperCase();
				  }
				  return;
          }
          return hours.toString().split(".")[0] + " " + szhr + " " +
mints.toString().split(".")[0] + " " + szmin;
      }
  }
 exports.main = main;
