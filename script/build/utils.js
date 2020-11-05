function replacePath(path, newPath) {
  newPath.forEach((item) => path.insertBefore(item));
  path.remove();
}

function copyComments(newNode, node) {
  newNode.innerComments = node.innerComments;
  newNode.leadingComments = node.leadingComments;
}

module.exports = {
  replacePath,
  copyComments,
};
