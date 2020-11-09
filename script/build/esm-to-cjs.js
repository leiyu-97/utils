/**
 * 本 transformer 并非将 esm 完美编译为 cjs
 * 而是将 esm 写法转为 cjs 写法，因此在 default 的处理上会有不同
 * 在 esm 中 export default 在 cjs 中会变为 module.exports =
 */
const { replacePath } = require('./utils');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      ExportAllDeclaration(path) {
        // export * from './foo'
        // =>
        // Object.assign(module.exports, require('./foo'))
        const newPath = [];
        const { node } = path;
        const { source } = node;
        const callee = t.identifier('require');
        const requireExpression = t.callExpression(callee, [source]);
        const objectAssign = t.memberExpression(t.identifier('Object'), t.identifier('assign'));
        const expression = t.callExpression(objectAssign, [t.identifier('exports'), requireExpression]);
        newPath.push(t.expressionStatement(expression));
        replacePath(path, newPath);
      },
      ExportDefaultDeclaration(path) {
        // export default a;
        // =>
        // module.exports = a;
        const newPath = [];
        const { node } = path;
        const { declaration } = node;
        const left = t.memberExpression(t.identifier('module'), t.identifier('exports'));
        let right;
        if (t.isDeclaration(declaration)) {
          // 如果是 export 了一个 declaration，则先单独执行表达式再赋值 module.exports
          declaration.leadingComments = node.leadingComments;
          declaration.innerComments = node.innerComments;
          newPath.push(declaration);
          const { id } = declaration;
          right = id;
        } else {
          // 如果本身就是 export 了 identifier 则直接赋值 module.exports
          right = declaration;
        }
        const expression = t.assignmentExpression('=', left, right);
        newPath.push(t.expressionStatement(expression));
        replacePath(path, newPath);
      },
      ExportNamedDeclaration(path) {
        const newPath = [];
        const { node } = path;
        const { declaration, source, specifiers } = node;
        if (t.isStringLiteral(source)) {
          // export { foo as bar } form './foo'
          // =>
          // exports.bar = require('./foo').foo
          const requirement = t.callExpression(t.identifier('require'), [source]);
          specifiers.forEach((specifier) => {
            const { local, exported } = specifier;
            const left = t.memberExpression(t.identifier('exports'), exported);
            let right;
            if (t.isIdentifier(local, { name: 'default' }) || t.isExportNamespaceSpecifier(specifier)) {
              // 由于 export default 时是直接覆盖了 module.exports
              // 因此在 import 的时候也不需要在后面加 .default
              right = requirement;
            } else {
              right = t.memberExpression(requirement, local);
            }
            const expression = t.assignmentExpression('=', left, right);
            newPath.push(t.expressionStatement(expression));
          });
        } else {
          declaration.leadingComments = node.leadingComments;
          declaration.innerComments = node.innerComments;
          newPath.push(declaration);
          // export const a = 1;
          // =>
          // const a = 1;
          // exports.a = a;
          const ids = [];
          if (t.isVariableDeclaration(declaration)) {
            // variableDeclaration 可以同时声明多个变量，因此需要分别赋值
            declaration.declarations.forEach((item) => ids.push(item.id));
          } else {
            // functionDeclaration
            ids.push(declaration.id);
          }
          ids.forEach((id) => {
            const object = t.identifier('exports');
            const property = id;
            const left = t.memberExpression(object, property);
            const right = id;
            const expression = t.assignmentExpression('=', left, right);
            newPath.push(t.expressionStatement(expression));
          });
        }
        replacePath(path, newPath);
      },
      ImportDeclaration(path) {
        const newPath = [];
        const { node } = path;
        const { source, specifiers } = node;
        const callee = t.identifier('require');
        const init = t.callExpression(callee, [source]);

        const defaultSpecifiers = [];
        const nonDefaultSpecifiers = [];
        specifiers.forEach((specifier) =>
          (t.isImportDefaultSpecifier(specifier) || t.isImportNamespaceSpecifier(specifier)
            ? defaultSpecifiers
            : nonDefaultSpecifiers
          ).push(specifier),
        );
        // import bar from './foo'
        // =>
        // const bar = require('./foo')
        defaultSpecifiers.forEach((specify) => {
          const declarations = [t.variableDeclarator(specify.local, init)];
          newPath.push(t.variableDeclaration('const', declarations));
        });

        // import bar from './foo'
        // =>
        // const bar = require('./foo')
        if (nonDefaultSpecifiers.length) {
          const properties = nonDefaultSpecifiers.map(({ local, imported }) => t.objectProperty(local, imported));
          const kind = t.objectPattern(properties);
          const declarations = [t.variableDeclarator(kind, init)];
          newPath.push(t.variableDeclaration('const', declarations));
        }

        replacePath(path, newPath);
      },
    },
  };
};
