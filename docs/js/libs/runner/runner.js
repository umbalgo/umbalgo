"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Executes a foreign-language function modeled as a Function object.
 */
var Runner = function () {
  /**
   * Construct a runner, and break at the first line of execution.
   * @param func {ForeignFunction} A function model object, instantiated with the
   *     appropriate arguments
   */
  function Runner() {
    _classCallCheck(this, Runner);

    /** Map of available functions. */
    this.functions = {};
    /** The call stack */
    this.callStack = [];
    /** The callback for returning the result of current function */
    this.resultcb = undefined;
  }
  /**
   * Register a new function
   * @param identifier {String} The function model's identifier
   * @param func {ForeignFunction} An object modeling a foreign function
   */


  _createClass(Runner, [{
    key: "register",
    value: function register(identifier, func) {
      this.functions[identifier] = func_factory;
    }
    /**
     * Invoke a function by name, with the supplied arguments.
     * @param {String} identifier The identifier of the function to be invoked
     * @param {resultcb} A single parameter function to receive the return value
     * @param {...} args A variadic argument list to be applied to the function
    */

  }, {
    key: "invoke",
    value: function invoke(identifier, resultcb) {
      var _functions;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      this.callStack.push((_functions = this.functions)[identifier].apply(_functions, [runner, resultcb].concat(args)));
    }
    /**
     * Execute next line of code and trigger corresponding callback.
     */

  }, {
    key: "next",
    value: function next() {
      if (this.callStack.size && this.callStack[this.callStack.size] === undefined) {
        this.callStack.pop();
      }
      if (this.callStack.size) {
        this.callStack[this.callStack.size].next();
      }
    }
    /**
     * Trigger next UI transition.
     */

  }, {
    key: "triggerUi",
    value: function triggerUi(identifier, lineNumber) {
      console.log("Executed identifier():" + lineNumber);
    }
  }]);

  return Runner;
}();

/**
 * A model of a foreign-language function.
 */


var ForeignFunction = function () {
  /**
   * Constructs a foreign function from an array of lines of annotated foreign
   * code, each paired with an equiivalent javascript function.
   * @param runner {Runner} The runner that invoked this function.
   * @param {resultcb} A single parameter function to provide the return value
   * @param json {Array} An array of annotated foreign code lines.
   */
  function ForeignFunction(runner, resultcb, json) {
    _classCallCheck(this, ForeignFunction);

    /** The object literal that describes this foreign function model. */
    this.definition = JSON.parse(json);
    /** This function's identifier */
    this.identifier = (this.definition[0]["JavaScript"] + "}").match(/^\s*(\w+)/m)[0];
    /** The runner that invoked this function. */
    this.runner = runner;
    /** A map of the arguments this function was invoked with. */
    this.args = {};
    /** A map of the function's local variables. */
    this.locals = {};
    /** An array of maps of helper variables for each line. */
    this.helpers = Array(this.definition.length).fill({});
    /** The currently executing line number. */
    this.currentLineNumber = undefined;
    /** The next line to be executed line number. */
    this.nextLineNumber = undefined;
    /** The result of this function. */
    this.resultcb = undefined;

    // Register this function with the runner
    this.runner.register(this.name, function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return new (Function.prototype.bind.apply(this, [null].concat(args)))();
    });
  }
  /**
   * Invoke this function.
   * @param args {...} The arguments to invoke with.
   */


  _createClass(ForeignFunction, [{
    key: "invoke",
    value: function invoke() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      // Set the current line to the first line of the function (the declaration).
      this.runner.currentLineNumber = 1;
      // Set the next line to executed to the second line fo the function (the
      // first line of the body).
      this.runner.nextLineNumber = 2;
      // Create an array of this function's parameters' names
      params = (this.definition[0]["JavaScript"] + "}").match(/^\s*(\w+)\s*\(\s*([^)]*)\s*\)/m)[1].split(/,/).map(function (s) {
        return s.trim();
      });
      // Populate this functions arguments map
      for (i = 0; i < arguments.length; ++i) {
        args[params[i]] = arguments[i];
      }
    }
    /**
     * Advance to the next line of the function.
     */

  }, {
    key: "next",
    value: function next() {
      // Advance to the next line.
      this.currentLineNumber = this.nextLineNumber;
      // Execute the JavaScript implementation of this line.
      this.definition[this.currentLineNumber - 1]["JavaScript"]();
      // Invoke a callback with this line number as an argument. This callback
      // will manipulate the view.
      this.runner.triggerUi(currentLineNumber);
    }
  }]);

  return ForeignFunction;
}();