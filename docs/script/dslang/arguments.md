---
sidebar_position: 13
---

# Extensions & Arguments

Batch scripts are essential parts of hardware debugging and the script engine and it is mainly used to automate debugging tasks.

Based on the complexity of developing different parts of the debugger and the fact that there are tens of considerations on developing automated tasks in hwdbg, it is preferred to use the script engine to implement many features and commands. That is why hwdbg came with a set of pre-defined scripts. 

Hardware engineers can write their own scripts to automate debugging routines without worrying about hwdbg internals, as most limitations are checked through the script functions.

Hardware engineers can use plain text files for batch scripts, but as the convention, hwdbg uses (**.ds**) extensions, the abbreviation of **D**ebugger **S**cript.

Arguments are passed to the scripts by using the `\$arg0`, `\$arg1`, `\$arg2`, ..., `\$arg100`, ..., `\$arg1000` and so on.

The first argument (`\$arg0`) is the script's **.ds** file path. Arguments can be both an expression, a constant, or a string. Constants are considered in hex format if no prefix is specified.