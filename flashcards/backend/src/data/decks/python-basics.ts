import { createDeck, textCard, mcCard, SeedDeck } from "./types";

export const pythonBasics: SeedDeck = createDeck(
  "Python Programming Basics",
  "Learn Python programming fundamentals. Covers variables, data types, operators, strings, lists, control flow, functions, modules, error handling, file operations, and list comprehensions.",
  ["programming", "it", "certification"],
  [
  // Fundamentals
  mcCard(
    "How do you print 'Hello World' in Python?",
    ["print('Hello World')", "console.log('Hello World')", "echo 'Hello World'"],
    0,
    "Python uses the print() function for output."
  ),
  mcCard(
    "How do you create a comment in Python?",
    ["# This is a comment", "// This is a comment", "/* This is a comment */"],
    0,
    "Python uses # for single-line comments."
  ),
  mcCard(
    "How do you create a variable?",
    ["x = 5", "var x = 5", "int x = 5"],
    0,
    "Python doesn't require type declarations - just assign a value."
  ),
  mcCard(
    "What is indentation used for in Python?",
    ["Defines code blocks (required)", "Just for readability (optional)", "Creates comments"],
    0,
    "Indentation defines code blocks for if statements, loops, and functions. It's required, not optional."
  ),
  mcCard(
    "Which of these is correct string syntax?",
    ["Both 'text' and \"text\" work", "Only 'text' works", "Only \"text\" works"],
    0,
    "Python accepts both single and double quotes for strings."
  ),

  // Data Types
  mcCard(
    "What is a list in Python?",
    ["An ordered, mutable collection", "An immutable sequence", "A key-value collection"],
    0,
    "A list is an ordered, mutable collection of items: my_list = [1, 2, 3]"
  ),
  mcCard(
    "What is a tuple in Python?",
    ["An ordered, immutable collection", "An ordered, mutable collection", "An unordered collection"],
    0,
    "A tuple is an ordered, immutable collection: my_tuple = (1, 2, 3)"
  ),
  mcCard(
    "What is a dictionary in Python?",
    ["A collection of key-value pairs", "An ordered list of items", "A set of unique values"],
    0,
    "A dictionary is a collection of key-value pairs: my_dict = {'name': 'John', 'age': 30}"
  ),
  mcCard(
    "What is a set in Python?",
    ["An unordered collection of unique items", "An ordered list of items", "A key-value collection"],
    0,
    "A set is an unordered collection of unique items: my_set = {1, 2, 3}"
  ),
  mcCard(
    "What type does 3.14 have?",
    ["float", "int", "double"],
    0,
    "Decimal numbers are float type in Python."
  ),
  mcCard(
    "What type does 'Hello' have?",
    ["str", "String", "text"],
    0,
    "Text values are str (string) type in Python."
  ),
  mcCard(
    "What is the boolean type in Python?",
    ["True and False", "true and false", "1 and 0"],
    0,
    "Python booleans are capitalized: True and False."
  ),

  // Operators
  mcCard(
    "What is the output of: 3 ** 2",
    ["9", "6", "32"],
    0,
    "** is the exponentiation operator (3 to the power of 2)."
  ),
  mcCard(
    "What is the output of: 7 // 2",
    ["3", "3.5", "4"],
    0,
    "// is floor division - divides and rounds down."
  ),
  mcCard(
    "What is the output of: 7 % 2",
    ["1", "3", "3.5"],
    0,
    "% is modulo - returns the remainder."
  ),
  mcCard(
    "How do you check if two values are equal?",
    ["==", "=", "==="],
    0,
    "== compares values; = is assignment."
  ),
  mcCard(
    "How do you check if two values are NOT equal?",
    ["!=", "<>", "=/="],
    0,
    "!= checks for inequality in Python."
  ),

  // String Operations
  mcCard(
    "How do you get the length of a string?",
    ["len(string)", "string.length()", "string.size()"],
    0,
    "len() is a built-in function for length."
  ),
  mcCard(
    "How do you concatenate strings?",
    ["Use + or f-strings", "Use .concat()", "Use .join() only"],
    0,
    "Use + operator: 'Hello' + ' ' + 'World' or f-strings: f'{first} {last}'"
  ),
  mcCard(
    "How do you convert a string to uppercase?",
    ["string.upper()", "string.uppercase()", "upper(string)"],
    0,
    ".upper() is a string method."
  ),
  mcCard(
    "What is an f-string?",
    ["Formatted string with embedded expressions", "A file string", "A function string"],
    0,
    "f'Hello {name}' is an f-string - allows embedding expressions in strings."
  ),
  mcCard(
    "How do you access the first character of a string?",
    ["string[0]", "string[1]", "string.first()"],
    0,
    "string[0] - Python uses zero-based indexing."
  ),
  mcCard(
    "How do you slice a string?",
    ["string[start:end]", "string.slice(start, end)", "string.substring(start, end)"],
    0,
    "string[start:end] excludes end index. string[1:4] gets characters at index 1, 2, 3."
  ),

  // Lists
  mcCard(
    "How do you add an item to a list?",
    ["list.append(item)", "list.add(item)", "list.push(item)"],
    0,
    "list.append(item) adds to the end, list.insert(index, item) adds at position."
  ),
  mcCard(
    "How do you remove an item from a list?",
    ["list.remove(item) or list.pop(index)", "list.delete(item)", "remove(list, item)"],
    0,
    "list.remove(item) by value, list.pop(index) by index, del list[index]."
  ),
  mcCard(
    "How do you access the last item in a list?",
    ["list[-1]", "list[len(list)]", "list.last()"],
    0,
    "Negative indices count from the end."
  ),
  mcCard(
    "How do you sort a list?",
    ["list.sort() or sorted(list)", "list.order()", "sort(list)"],
    0,
    "list.sort() modifies in place, sorted(list) returns a new sorted list."
  ),
  mcCard(
    "How do you reverse a list?",
    ["list.reverse() or list[::-1]", "list.flip()", "reverse(list)"],
    0,
    "list.reverse() modifies in place, list[::-1] returns reversed copy."
  ),

  // Control Flow
  mcCard(
    "What keyword follows 'if' for additional conditions?",
    ["elif", "else if", "elseif"],
    0,
    "Python uses elif for else-if conditions: if condition: ... elif other: ... else: ..."
  ),
  mcCard(
    "What is the syntax for a for loop?",
    ["for item in iterable:", "for (item in iterable)", "foreach item in iterable:"],
    0,
    "for item in iterable: do_something. Example: for i in range(5): print(i)"
  ),
  mcCard(
    "What is the syntax for a while loop?",
    ["while condition:", "while (condition)", "do while condition:"],
    0,
    "while condition: do_something. Be careful of infinite loops!"
  ),
  mcCard(
    "What does 'break' do in a loop?",
    ["Exits the loop immediately", "Skips to next iteration", "Pauses the loop"],
    0,
    "break exits the loop entirely."
  ),
  mcCard(
    "What does 'continue' do in a loop?",
    ["Skips to next iteration", "Exits the loop", "Restarts the loop"],
    0,
    "continue skips the rest of this iteration and goes to the next."
  ),
  mcCard(
    "What does range(5) generate?",
    ["0, 1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4, 5"],
    0,
    "range(5) generates numbers 0-4 (not including 5)."
  ),
  mcCard(
    "What does range(2, 8, 2) generate?",
    ["2, 4, 6", "2, 4, 6, 8", "2, 3, 4, 5, 6, 7"],
    0,
    "range(2, 8, 2) starts at 2, stops before 8, steps by 2: 2, 4, 6."
  ),

  // Functions
  mcCard(
    "How do you define a function?",
    ["def function_name():", "function function_name():", "func function_name():"],
    0,
    "def function_name(parameters): followed by indented code block."
  ),
  mcCard(
    "What does a function return if there's no return statement?",
    ["None", "0", "Empty string"],
    0,
    "Functions return None by default."
  ),
  mcCard(
    "What are *args and **kwargs?",
    ["Variable positional and keyword arguments", "Pointer arguments", "Required arguments"],
    0,
    "*args: variable positional arguments (tuple). **kwargs: variable keyword arguments (dictionary)."
  ),
  mcCard(
    "What is a lambda function?",
    ["Anonymous one-line function", "A named function", "A class method"],
    0,
    "Lambda is an anonymous one-line function: square = lambda x: x ** 2"
  ),

  // Modules and Imports
  mcCard(
    "How do you import a module?",
    ["import module_name", "include module_name", "require module_name"],
    0,
    "import module_name, or from module import function."
  ),
  mcCard(
    "How do you import with an alias?",
    ["import numpy as np", "import numpy alias np", "using numpy as np"],
    0,
    "import numpy as np - then use np.array() instead of numpy.array()."
  ),
  mcCard(
    "Where does Python look for modules?",
    ["Current directory, then installed packages", "Only installed packages", "Only current directory"],
    0,
    "Python searches the current directory first, then sys.path."
  ),

  // Error Handling
  mcCard(
    "How do you handle exceptions?",
    ["try: ... except: ...", "catch: ... throw: ...", "handle: ... error: ..."],
    0,
    "try: risky_code() except ErrorType: handle_error() finally: cleanup()"
  ),
  mcCard(
    "What exception is raised when accessing a non-existent key?",
    ["KeyError", "IndexError", "ValueError"],
    0,
    "KeyError for dictionaries, IndexError for lists."
  ),
  mcCard(
    "How do you raise an exception?",
    ["raise ValueError('message')", "throw ValueError('message')", "error ValueError('message')"],
    0,
    "raise ValueError('Error message') raises an exception."
  ),

  // File Operations
  mcCard(
    "How do you read a file?",
    ["with open('file.txt', 'r') as f:", "File.read('file.txt')", "read('file.txt')"],
    0,
    "with open('file.txt', 'r') as f: content = f.read()"
  ),
  mcCard(
    "How do you write to a file?",
    ["with open('file.txt', 'w') as f:", "File.write('file.txt')", "write('file.txt')"],
    0,
    "with open('file.txt', 'w') as f: f.write('content')"
  ),
  mcCard(
    "Why use 'with' for file operations?",
    ["Automatically closes file when done", "Makes code run faster", "Required for file access"],
    0,
    "with automatically closes the file when done, even if an error occurs."
  ),

  // Common Built-in Functions
  mcCard(
    "What does len() do?",
    ["Returns length of a sequence", "Returns last element", "Returns type of object"],
    0,
    "len() returns the length of a sequence (string, list, etc.)."
  ),
  mcCard(
    "What does type() do?",
    ["Returns the type of an object", "Returns the length", "Converts types"],
    0,
    "type() returns the type of an object: type(5) returns <class 'int'>."
  ),
  mcCard(
    "What does input() do?",
    ["Reads user input as string", "Writes to console", "Reads from file"],
    0,
    "input() reads user input from keyboard, always returns a string."
  ),
  mcCard(
    "What does int() do?",
    ["Converts a value to integer", "Checks if value is integer", "Rounds a number"],
    0,
    "int() converts a value to integer: int('42') returns 42."
  ),
  mcCard(
    "What does str() do?",
    ["Converts a value to string", "Checks if value is string", "Strips whitespace"],
    0,
    "str() converts a value to string: str(42) returns '42'."
  ),
  mcCard(
    "What does list() do?",
    ["Creates or converts to a list", "Returns list length", "Sorts a list"],
    0,
    "list() creates a list or converts an iterable to a list."
  ),
  mcCard(
    "What does enumerate() do?",
    ["Returns index-value pairs", "Counts items", "Enumerates types"],
    0,
    "enumerate() returns index-value pairs: for i, val in enumerate(list)."
  ),
  mcCard(
    "What does zip() do?",
    ["Combines iterables into pairs", "Compresses data", "Zips files together"],
    0,
    "zip() combines iterables: zip([1,2], ['a','b']) gives [(1,'a'), (2,'b')]."
  ),

  // List Comprehensions
  mcCard(
    "What is a list comprehension?",
    ["Concise way to create lists", "A way to sort lists", "A list method"],
    0,
    "[x**2 for x in range(5)] creates [0, 1, 4, 9, 16] - concise list creation."
  ),
  mcCard(
    "How do you add a condition to list comprehension?",
    ["Add 'if condition' at end", "Use 'where' keyword", "Use 'filter' function only"],
    0,
    "[x for x in range(10) if x % 2 == 0] filters for even numbers."
  ),
]);
