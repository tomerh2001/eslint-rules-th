const meta = {
	type: 'suggestion',
	docs: {
		description: 'Require all top-level functions to be named/regular functions.',
		category: 'Stylistic Issues',
		recommended: false,
		url: 'https://github.com/tomerh2001/eslint-plugin-th-rules/blob/main/docs/rules/top-level-functions.md',
	},
	fixable: 'code',
	schema: [],
};

function create(context) {
	return {
		VariableDeclarator(node) {
			if (node.parent.parent.type !== 'Program') {
				return;
			}

			if (!(node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression'))) {
				return;
			}

			const sourceCode = context.getSourceCode();
			const functionText = sourceCode.getText(node.init);
			const functionName = node.id.name;

			context.report({
				node: node.init,
				message: 'Top-level functions must be named/regular functions.',
				fix(fixer) {
					const fixedCode = `function ${functionName}${functionText.slice(functionText.indexOf('('))}`;
					return fixer.replaceText(node, fixedCode);
				},
			});
		},

		FunctionDeclaration(node) {
			if (node.id) {
				return;
			}

			if (node.parent.type === 'Program') {
				context.report({
					node,
					message: 'Top-level functions must be named.',
					fix(fixer) {
						const functionName = 'defaultFunction';
						const sourceCode = context.getSourceCode();
						const functionText = sourceCode.getText(node);
						const fixedCode = functionText.replace('function (', `function ${functionName}(`);

						return fixer.replaceText(node, fixedCode);
					},
				});
			}
		},
	};
}

const rule = {
	meta,
	create,
};

module.exports = rule;
