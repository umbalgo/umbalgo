// Code:private Node deleteMax(Node x) {
deleteMax(x) {
// Code:  if (x.left == null) {
  that.nextLineNumber = that.args["x"].left === null ? 3 : 5;
// Code:    return x.left;
  that.result = that.args["x"].left;
  that.nextLineNumber = undefined;
// Code:  }
  that.nextLineNumber = 5;
// Code:  x.left = deleteMin(x.left);
  that.vm.invokeFunc(
    "deleteMin",
    function(result) {
      that.args["x"].left = result;
      that.nextLineNumber = 6;
    },
    that.locals["x"].left);
// Code:  x.N = size(x.left) + size(x.left) + 1;
  that.args["x"].N = (that.args["x"].left === null ? 0 : that.args["x"].left.N)
    + (that.args["x"].left === null ? 0 : that.args["x"].left.N) + 1;
  that.nextLineNumber = 7;
// Code:  return x;
  that.result = that.args["x"];
  that.nextLineNumber = undefined;
// Code:}
