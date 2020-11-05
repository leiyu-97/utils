const { copyComments } = require('./utils');

module.exports = function ({ types: t }) {
  return {
    visitor: {
      TSEnumDeclaration(path) {
        const { node } = path;
        const { id } = node;
        const properties = node.members.map((member) => {
          const property = t.objectProperty(member.id, member.initializer);
          copyComments(property, member);
          return property;
        });
        const object = t.objectExpression(properties);
        const declarator = t.variableDeclarator(id, object);
        const declaration = t.variableDeclaration('const', [declarator]);
        path.replaceWith(declaration);
      },
    },
  };
};
