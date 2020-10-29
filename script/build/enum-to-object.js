module.exports = function ({ types: t }) {
  return {
    visitor: {
      TSEnumDeclaration(path) {
        const { node } = path;
        const { id } = node;
        const properties = node.members.map(({ initializer, id: memberId }) =>
          t.objectProperty(memberId, initializer));
        const object = t.objectExpression(properties);
        const declarator = t.variableDeclarator(id, object);
        const declaration = t.variableDeclaration('const', [declarator]);
        path.replaceWith(declaration);
      },
    },
  };
};
