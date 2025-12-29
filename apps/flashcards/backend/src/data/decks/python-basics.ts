import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const pythonBasics: SeedDeck = createDeck(
  "a1b2c3d4-1111-4000-8000-000000000010",
  "Python Programming Basics",
  "Learn Python programming fundamentals. Covers variables, data types, operators, strings, lists, control flow, functions, modules, error handling, file operations, and list comprehensions.",
  ["programming", "it", "certification"],
  [
  // Fundamentals
  mcCard(
    "How do you print 'Hello World' in Python?",
    ["print('Hello World')", "console.log('Hello World')", "echo 'Hello World'"],
    0,
    { explanation: "Python uses the print() function for output.", researchUrl: "https://docs.python.org/3/library/functions.html#print" }
  ),
  mcCard(
    "How do you create a comment in Python?",
    ["# This is a comment", "// This is a comment", "/* This is a comment */"],
    0,
    { explanation: "Python uses # for single-line comments.", researchUrl: "https://docs.python.org/3/reference/lexical_analysis.html#comments" }
  ),
  mcCard(
    "How do you create a variable?",
    ["x = 5", "var x = 5", "int x = 5"],
    0,
    { explanation: "Python doesn't require type declarations - just assign a value.", researchUrl: "https://docs.python.org/3/tutorial/introduction.html#numbers" }
  ),
  mcCard(
    "What is indentation used for in Python?",
    ["Defines code blocks (required)", "Just for readability (optional)", "Creates comments"],
    0,
    { explanation: "Indentation defines code blocks for if statements, loops, and functions. It's required, not optional.", researchUrl: "https://docs.python.org/3/reference/lexical_analysis.html#indentation" }
  ),
  mcCard(
    "Which of these is correct string syntax?",
    ["Both 'text' and \"text\" work", "Only 'text' works", "Only \"text\" works"],
    0,
    { explanation: "Python accepts both single and double quotes for strings.", researchUrl: "https://docs.python.org/3/tutorial/introduction.html#strings" }
  ),

  // Data Types
  mcCard(
    "What is a list in Python?",
    ["An ordered, mutable collection", "An immutable sequence", "A key-value collection"],
    0,
    { explanation: "A list is an ordered, mutable collection of items: my_list = [1, 2, 3]", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" }
  ),
  mcCard(
    "What is a tuple in Python?",
    ["An ordered, immutable collection", "An ordered, mutable collection", "An unordered collection"],
    0,
    { explanation: "A tuple is an ordered, immutable collection: my_tuple = (1, 2, 3)", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences" }
  ),
  mcCard(
    "What is a dictionary in Python?",
    ["A collection of key-value pairs", "An ordered list of items", "A set of unique values"],
    0,
    { explanation: "A dictionary is a collection of key-value pairs: my_dict = {'name': 'John', 'age': 30}", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" }
  ),
  mcCard(
    "What is a set in Python?",
    ["An unordered collection of unique items", "An ordered list of items", "A key-value collection"],
    0,
    { explanation: "A set is an unordered collection of unique items: my_set = {1, 2, 3}", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#sets" }
  ),
  mcCard(
    "What type does 3.14 have?",
    ["float", "int", "double"],
    0,
    { explanation: "Decimal numbers are float type in Python.", researchUrl: "https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex" }
  ),
  mcCard(
    "What type does 'Hello' have?",
    ["str", "String", "text"],
    0,
    { explanation: "Text values are str (string) type in Python.", researchUrl: "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str" }
  ),
  mcCard(
    "What is the boolean type in Python?",
    ["True and False", "true and false", "1 and 0"],
    0,
    { explanation: "Python booleans are capitalized: True and False.", researchUrl: "https://docs.python.org/3/library/stdtypes.html#boolean-values" }
  ),

  // Operators
  mcCard(
    "What is the output of: 3 ** 2",
    ["9", "6", "32"],
    0,
    { explanation: "** is the exponentiation operator (3 to the power of 2).", researchUrl: "https://docs.python.org/3/reference/expressions.html#the-power-operator" }
  ),
  mcCard(
    "What is the output of: 7 // 2",
    ["3", "3.5", "4"],
    0,
    { explanation: "// is floor division - divides and rounds down.", researchUrl: "https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations" }
  ),
  mcCard(
    "What is the output of: 7 % 2",
    ["1", "3", "3.5"],
    0,
    { explanation: "% is modulo - returns the remainder.", researchUrl: "https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations" }
  ),
  mcCard(
    "How do you check if two values are equal?",
    ["==", "=", "==="],
    0,
    { explanation: "== compares values; = is assignment.", researchUrl: "https://docs.python.org/3/reference/expressions.html#comparisons" }
  ),
  mcCard(
    "How do you check if two values are NOT equal?",
    ["!=", "<>", "=/="],
    0,
    { explanation: "!= checks for inequality in Python.", researchUrl: "https://docs.python.org/3/reference/expressions.html#comparisons" }
  ),

  // String Operations
  mcCard(
    "How do you get the length of a string?",
    ["len(string)", "string.length()", "string.size()"],
    0,
    { explanation: "len() is a built-in function for length.", researchUrl: "https://docs.python.org/3/library/functions.html#len" }
  ),
  mcCard(
    "How do you concatenate strings?",
    ["Use + or f-strings", "Use .concat()", "Use .join() only"],
    0,
    { explanation: "Use + operator: 'Hello' + ' ' + 'World' or f-strings: f'{first} {last}'", researchUrl: "https://docs.python.org/3/tutorial/introduction.html#strings" }
  ),
  mcCard(
    "How do you convert a string to uppercase?",
    ["string.upper()", "string.uppercase()", "upper(string)"],
    0,
    { explanation: ".upper() is a string method.", researchUrl: "https://docs.python.org/3/library/stdtypes.html#str.upper" }
  ),
  mcCard(
    "What is an f-string?",
    ["Formatted string with embedded expressions", "A file string", "A function string"],
    0,
    { explanation: "f'Hello {name}' is an f-string - allows embedding expressions in strings.", researchUrl: "https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals" }
  ),
  mcCard(
    "How do you access the first character of a string?",
    ["string[0]", "string[1]", "string.first()"],
    0,
    { explanation: "string[0] - Python uses zero-based indexing.", researchUrl: "https://docs.python.org/3/tutorial/introduction.html#strings" }
  ),
  mcCard(
    "How do you slice a string?",
    ["string[start:end]", "string.slice(start, end)", "string.substring(start, end)"],
    0,
    { explanation: "string[start:end] excludes end index. string[1:4] gets characters at index 1, 2, 3.", researchUrl: "https://docs.python.org/3/tutorial/introduction.html#strings" }
  ),

  // Lists
  mcCard(
    "How do you add an item to a list?",
    ["list.append(item)", "list.add(item)", "list.push(item)"],
    0,
    { explanation: "list.append(item) adds to the end, list.insert(index, item) adds at position.", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" }
  ),
  mcCard(
    "How do you remove an item from a list?",
    ["list.remove(item) or list.pop(index)", "list.delete(item)", "remove(list, item)"],
    0,
    { explanation: "list.remove(item) by value, list.pop(index) by index, del list[index].", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" }
  ),
  mcCard(
    "How do you access the last item in a list?",
    ["list[-1]", "list[len(list)]", "list.last()"],
    0,
    { explanation: "Negative indices count from the end.", researchUrl: "https://docs.python.org/3/tutorial/introduction.html#lists" }
  ),
  mcCard(
    "How do you sort a list?",
    ["list.sort() or sorted(list)", "list.order()", "sort(list)"],
    0,
    { explanation: "list.sort() modifies in place, sorted(list) returns a new sorted list.", researchUrl: "https://docs.python.org/3/howto/sorting.html" }
  ),
  mcCard(
    "How do you reverse a list?",
    ["list.reverse() or list[::-1]", "list.flip()", "reverse(list)"],
    0,
    { explanation: "list.reverse() modifies in place, list[::-1] returns reversed copy.", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists" }
  ),

  // Control Flow
  mcCard(
    "What keyword follows 'if' for additional conditions?",
    ["elif", "else if", "elseif"],
    0,
    { explanation: "Python uses elif for else-if conditions: if condition: ... elif other: ... else: ...", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#if-statements" }
  ),
  mcCard(
    "What is the syntax for a for loop?",
    ["for item in iterable:", "for (item in iterable)", "foreach item in iterable:"],
    0,
    { explanation: "for item in iterable: do_something. Example: for i in range(5): print(i)", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#for-statements" }
  ),
  mcCard(
    "What is the syntax for a while loop?",
    ["while condition:", "while (condition)", "do while condition:"],
    0,
    { explanation: "while condition: do_something. Be careful of infinite loops!", researchUrl: "https://docs.python.org/3/reference/compound_stmts.html#the-while-statement" }
  ),
  mcCard(
    "What does 'break' do in a loop?",
    ["Exits the loop immediately", "Skips to next iteration", "Pauses the loop"],
    0,
    { explanation: "break exits the loop entirely.", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops" }
  ),
  mcCard(
    "What does 'continue' do in a loop?",
    ["Skips to next iteration", "Exits the loop", "Restarts the loop"],
    0,
    { explanation: "continue skips the rest of this iteration and goes to the next.", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops" }
  ),
  mcCard(
    "What does range(5) generate?",
    ["0, 1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5"],
    0,
    { explanation: "range(5) generates numbers 0-4 (not including 5).", researchUrl: "https://docs.python.org/3/library/stdtypes.html#range" }
  ),
  mcCard(
    "What does range(2, 8, 2) generate?",
    ["2, 4, 6", "2, 4, 6, 8", "2, 3, 4, 5, 6, 7"],
    0,
    { explanation: "range(2, 8, 2) starts at 2, stops before 8, steps by 2: 2, 4, 6.", researchUrl: "https://docs.python.org/3/library/stdtypes.html#range" }
  ),

  // Functions
  mcCard(
    "How do you define a function?",
    ["def function_name():", "function function_name():", "func function_name():"],
    0,
    { explanation: "def function_name(parameters): followed by indented code block.", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" }
  ),
  mcCard(
    "What does a function return if there's no return statement?",
    ["None", "0", "Empty string"],
    0,
    { explanation: "Functions return None by default.", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" }
  ),
  mcCard(
    "What are *args and **kwargs?",
    ["Variable positional and keyword arguments", "Pointer arguments", "Required arguments"],
    0,
    { explanation: "*args: variable positional arguments (tuple). **kwargs: variable keyword arguments (dictionary).", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#arbitrary-argument-lists" }
  ),
  mcCard(
    "What is a lambda function?",
    ["Anonymous one-line function", "A named function", "A class method"],
    0,
    { explanation: "Lambda is an anonymous one-line function: square = lambda x: x ** 2", researchUrl: "https://docs.python.org/3/tutorial/controlflow.html#lambda-expressions" }
  ),

  // Modules and Imports
  mcCard(
    "How do you import a module?",
    ["import module_name", "include module_name", "require module_name"],
    0,
    { explanation: "import module_name, or from module import function.", researchUrl: "https://docs.python.org/3/tutorial/modules.html" }
  ),
  mcCard(
    "How do you import with an alias?",
    ["import numpy as np", "import numpy alias np", "using numpy as np"],
    0,
    { explanation: "import numpy as np - then use np.array() instead of numpy.array().", researchUrl: "https://docs.python.org/3/tutorial/modules.html#packages" }
  ),
  mcCard(
    "Where does Python look for modules?",
    ["Current directory, then installed packages", "Only installed packages", "Only current directory"],
    0,
    { explanation: "Python searches the current directory first, then sys.path.", researchUrl: "https://docs.python.org/3/tutorial/modules.html#the-module-search-path" }
  ),

  // Error Handling
  mcCard(
    "How do you handle exceptions?",
    ["try: ... except: ...", "catch: ... throw: ...", "handle: ... error: ..."],
    0,
    { explanation: "try: risky_code() except ErrorType: handle_error() finally: cleanup()", researchUrl: "https://docs.python.org/3/tutorial/errors.html#handling-exceptions" }
  ),
  mcCard(
    "What exception is raised when accessing a non-existent key?",
    ["KeyError", "IndexError", "ValueError"],
    0,
    { explanation: "KeyError for dictionaries, IndexError for lists.", researchUrl: "https://docs.python.org/3/library/exceptions.html#KeyError" }
  ),
  mcCard(
    "How do you raise an exception?",
    ["raise ValueError('message')", "throw ValueError('message')", "error ValueError('message')"],
    0,
    { explanation: "raise ValueError('Error message') raises an exception.", researchUrl: "https://docs.python.org/3/tutorial/errors.html#raising-exceptions" }
  ),

  // File Operations
  mcCard(
    "How do you read a file?",
    ["with open('file.txt', 'r') as f:", "File.read('file.txt')", "read('file.txt')"],
    0,
    { explanation: "with open('file.txt', 'r') as f: content = f.read()", researchUrl: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files" }
  ),
  mcCard(
    "How do you write to a file?",
    ["with open('file.txt', 'w') as f:", "File.write('file.txt')", "write('file.txt')"],
    0,
    { explanation: "with open('file.txt', 'w') as f: f.write('content')", researchUrl: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files" }
  ),
  mcCard(
    "Why use 'with' for file operations?",
    ["Automatically closes file when done", "Makes code run faster", "Required for file access"],
    0,
    { explanation: "with automatically closes the file when done, even if an error occurs.", researchUrl: "https://docs.python.org/3/reference/compound_stmts.html#the-with-statement" }
  ),

  // Common Built-in Functions
  mcCard(
    "What does len() do?",
    ["Returns length of a sequence", "Returns last element", "Returns type of object"],
    0,
    { explanation: "len() returns the length of a sequence (string, list, etc.).", researchUrl: "https://docs.python.org/3/library/functions.html#len" }
  ),
  mcCard(
    "What does type() do?",
    ["Returns the type of an object", "Returns the length", "Converts types"],
    0,
    { explanation: "type() returns the type of an object: type(5) returns <class 'int'>.", researchUrl: "https://docs.python.org/3/library/functions.html#type" }
  ),
  mcCard(
    "What does input() do?",
    ["Reads user input as string", "Writes to console", "Reads from file"],
    0,
    { explanation: "input() reads user input from keyboard, always returns a string.", researchUrl: "https://docs.python.org/3/library/functions.html#input" }
  ),
  mcCard(
    "What does int() do?",
    ["Converts a value to integer", "Checks if value is integer", "Rounds a number"],
    0,
    { explanation: "int() converts a value to integer: int('42') returns 42.", researchUrl: "https://docs.python.org/3/library/functions.html#int" }
  ),
  mcCard(
    "What does str() do?",
    ["Converts a value to string", "Checks if value is string", "Strips whitespace"],
    0,
    { explanation: "str() converts a value to string: str(42) returns '42'.", researchUrl: "https://docs.python.org/3/library/functions.html#func-str" }
  ),
  mcCard(
    "What does list() do?",
    ["Creates or converts to a list", "Returns list length", "Sorts a list"],
    0,
    { explanation: "list() creates a list or converts an iterable to a list.", researchUrl: "https://docs.python.org/3/library/functions.html#func-list" }
  ),
  mcCard(
    "What does enumerate() do?",
    ["Returns index-value pairs", "Counts items", "Enumerates types"],
    0,
    { explanation: "enumerate() returns index-value pairs: for i, val in enumerate(list).", researchUrl: "https://docs.python.org/3/library/functions.html#enumerate" }
  ),
  mcCard(
    "What does zip() do?",
    ["Combines iterables into pairs", "Compresses data", "Zips files together"],
    0,
    { explanation: "zip() combines iterables: zip([1,2], ['a','b']) gives [(1,'a'), (2,'b')].", researchUrl: "https://docs.python.org/3/library/functions.html#zip" }
  ),

  // List Comprehensions
  mcCard(
    "What is a list comprehension?",
    ["Concise way to create lists", "A way to sort lists", "A list method"],
    0,
    { explanation: "[x**2 for x in range(5)] creates [0, 1, 4, 9, 16] - concise list creation.", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" }
  ),
  mcCard(
    "How do you add a condition to list comprehension?",
    ["Add 'if condition' at end", "Use 'where' keyword", "Use 'filter' function only"],
    0,
    { explanation: "[x for x in range(10) if x % 2 == 0] filters for even numbers.", researchUrl: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" }
  ),
]);
