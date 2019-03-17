traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var builder = new FunctionBuilder();
			//var b=new builder.body[0].body;
			builder.FunctionName = functionName(node);
			builder.StartLine    = node.loc.start.line;
			builder.ParameterCount=node.params.length;
			traverseWithParents(node, function (child)
			 {
                 if (!child.keys)
                 {
                     
                 }
                 
                 });
                 }
                 });