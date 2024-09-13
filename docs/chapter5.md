# Script Engine & Scripting Language
This section discusses the debugger script language implemented in hwdbg.

# Parsing Custom Scripts

The script engine of the hwdbg consists of a back-end utilizing LL(1) and LALR(1) parsers for optimal efficiency, and a front-end employing a MASM Style syntax with C keywords (such as if, else, for) along with a customizable grammar. 

User-inputted scripts are parsed in either the PS or an external processor and then directed to the PL. These scripts are scanned by a lexer and parsed into an Intermediate Representation (IR), which is then transmitted via the shared Block RAM over the AXI interface into the PL for execution. Subsequently, a buffer is incrementally populated with the execution results and sent back to the PS using the same shared BRAM. This approach yields significant debugging capabilities and enhancements compared to conventional logic analyzers like Xilinx Integrated Logic Analyzer (ILA) and other methods used in commodity logic analyzers, where commands and scripts are much simpler and with less flexibility. Once the IR is ready, the entire script (IR) is sent into the PL, and the response is transmitted back into the PS, creating a unidirectional flow.

It is also feasible to designate a script as the action of an event. In this scenario, the parsed IR script is stored in the BRAM. Upon the triggering of a corresponding event, the IR is executed locally by PL, thereby enhancing the execution performance of the script engine.


# Co-Design of Software Interpretation and Hardware Execution

The interpretation and execution module for user-defined scripts is implemented in separate stages. First, a software-based interpretation engine reads the user-defined scripts and produces a custom Intermediate Representation (IR). This software can run either on the FPGA's Processing System (PS) or on any PC running the debugger. Once the IR is generated, it is sent to the debuggee for hardware-level evaluation.

The evaluation is conducted in the Programmable Logic (PL) rather than the PS because hwdbg must support real-time signal evaluation and perform checks against the user script in every clock cycle. Due to potential slow communication between the PL and PS, the script execution engine is implemented in the hardware (PL) to ensure efficient and timely performance.

# Configure Port Adjustments

Upon generating the debugger hardware, the user is able to specify the exact **pin** and **port** configuration. Each **pin** is considered a single input wire (in VHDL `STD\_LOGIC`), while each **port** consists of multiple pins grouped together to form a meaningful value (in VHDL `STD\_LOGIC\_VECTOR`). Once the configuration is done, the generated debugger contains registers (refers to pins) and pseudo-registers (refers to ports). These pins and ports are accessible through custom script expressions (See Section `\ref{regs_and_pseudo_regs}`).

# Script Execution Stages

To enable on-the-fly script evaluation, script execution is divided into several stages. Each stage includes multiple flip-flops, with the number of flip-flops equal to the number of input pins. Additionally, each stage contains a small buffer (which could be either SRAM or flip-flop) that holds the specific operation to be performed in that stage.

After the debugger transmits the script buffer to the debuggee (PL), hwdbg configures these small buffers with the details of the actions (operators and values) required for each stage. The evaluation module then advances the registers to the next stage with each clock cycle. At each stage, the input flip-flops are evaluated according to the script, and the values of the pins may be modified based on the script's instructions. Once the execution completes all stages, the final stage passes the flip-flops to the *Output Policy Stage* (Described in Section `\ref{sec:output_policy_stage}`) before sending them to the output pins. The following figure depicts a 4-stage script evaluation engine. Note that the number of stages is configurable by the hardware engineer. For example, a debugger equipped with more script execution engines can run more operations within a single script, although this results in a larger hardware area (utilized resources in FPGAs).

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.9\linewidth]{Figures/exec-stages.pdf}
    \caption{4-Stage Script Evaluation and Execution Engine.}
    \label{fig:exec_stage}
\end{figure}
```

As mentioned earlier, each execution engine comes with a small buffer (SRAM or Flip-Flop) that contains local operations to that specific stage. This buffer conducts the script evaluation engine on how to behave with the signal at the corresponding stage. The following C structure shows how these local buffers are formed in hwdbg.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
typedef struct SYMBOL {
    long long unsigned Type;
    long long unsigned Len;
    long long unsigned VariableType;
    long long unsigned Value;
 } SYMBOL, * PSYMBOL;
\end{lstlisting}
```

# Output Policy Stage

The last stage before sending flop-flops (possibly modified input) is the *Output Policy Stage*. As its name implies this stage decides how outputs should be sent over the wires (pins). For example, some functions are designed to block output (send zero) which in reality these functions change the policy of this stage and influence the output signal. Other than that, functionalities like stepping through the signals (See Section `\ref{sec:stepping_emulation}`) and pausing the signals (See Section `\ref{sec:pausing_debuggee}`) are implemented by employing this mechanism. The following figure depicts how this mechanism is connected to the script execution stages.

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.9\linewidth]{Figures/exec-stages-and-output-policy.pdf}
    \caption{Script Evaluation Stages and Output Policy.}
    \label{fig:exec_stage_and_output_policy}
\end{figure}
```

# Script Engine

hwdbg use HyperDbg scripting (*dslang*) syntax which is a MASM-like syntax to evaluate script expressions. The *dslang* scripts are case-sensitive and hwdbg-specific keywords and functions start with `hw\_` prefix.

## Keywords
The keywords shown below are valid in hwdbg scripts.

```
\begin{table}[htbp]
\centering
\caption{Supported Keywords in hwdbg.}
\label{tab:keywords}
\scriptsize
\begin{tabular}{lll}
\hline
**Keyword** & **Description** \\
\hline
poi & Pointer-sized data from the specified address (dereference) \\
ref & Reference address of the specified variable  \\
db & Low 8 bits (dereference) \\
hi & High 16 bits (dereference) \\
low & Low 16 bits (dereference) \\
dw & Low 16 bits (dereference) \\
dd & Low 32 bits (dereference) \\
dq & 64 bits (dereference) \\
not & Flip each and every bit \\
neg & True/False logic flipping \\
\hline
\end{tabular}
\end{table}
```

## Operators

Multiple operators are supported in hwdbg. Note that operators like **multiplication**, **division**, and **modulus** are disabled by default since these operators negatively influence the critical path and decrease the overall supported clock speed. The user might enable these operators by manually configuring the chip generator.

### Operators Precedence/Priority (Expressions)

Operator precedence in normal expressions (assignments) is shown in Table below.

```
\begin{table}[htbp]
\centering
\caption{Operator Precedence (Expressions and Assignments).}
\label{tab:operator_precedence_expr}
\scriptsize
\begin{tabular}{lll}
\hline
**Operators** & **Description** \\
\hline
() & Parentheses \\
-+\textasciitilde * \& & Unary Operators (Unary negative, Unary positive, \\ & Bitwise not, Reference, Address of) \\
/\%* & Arithmetic Operators (Division, Modulo, Multiplication) \\
+- & Arithmetic Operators (Addition, Subtraction) \\
<$$$$< >$$$$> & Shift Operators (Right shift, Left shift) \\
\& & Bitwise AND Operator \\
\textasciicircum  & Bitwise XOR Operator (exclusive OR) \\
| & Bitwise OR Operator \\
\hline
\end{tabular}
\end{table}
```

### Operator Precedence/Priority (Boolean Expressions)
The following table shows operator precedence in boolean expressions.

```
\begin{table}[htbp]
\centering
\caption{Operator Precedence (Boolean Expressions).}
\label{tab:operator_precedence_boolean_expr}
\scriptsize
\begin{tabular}{lll}
\hline
**Operators** & **Description** \\
\hline
() & Parentheses \\
-+\textasciitilde * \& & Unary Operators (Unary negative, Unary positive, \\ & Bitwise not, Reference, Address of) \\
/\%* & Arithmetic Operators (Division, Modulo, Multiplication) \\
+- & Arithmetic Operators (Addition, Subtraction) \\
<$$$$< >$$$$> & Shift Operators (Right shift, Left shift) \\
>= < > <= ==  != & Shift Operators (Comparison operators) \\
\& & Bitwise AND Operator \\
\textasciicircum  & Bitwise XOR Operator (exclusive OR) \\
| & Bitwise OR Operator \\
\&\& & Logical AND \\
|| & Logical OR \\
\hline
\end{tabular}
\end{table}
```

## Registers \& Pseudo-registers
Here are the current registers and pseudo-registers supported by the script engine (See Table below). Note that registers (pins) start with '`@`' and pseudo-registers (ports) start with '`\$`'.

```
\begin{table}[htbp]
\centering
\caption{Registers and Pseudo-registers.}
\label{tab:regs_and_pseudo_regs}
\scriptsize
    \begin{tabular}{@{}>{\raggedright}p{4cm}p{8cm}@{}}
        \toprule
        **Registers** & **Pseudo-registers** \\
        \midrule
        `@hw\_pin0` & \multirow{4}{8cm}{$`\$hw\_clk`$, or $`\$hw\_clock`$: 1 or 0} \\
        `@hw\_pin1` & \\
        `...` & \\
        `@hw\_pinX` & \\
        `@hw\_port0` & \multirow{2}{8cm}{$`\$hw\_counter`$ and, $`\$hw\_clock\_edge\_counter`$} \\
        `@hw\_port1` & \\
        `...` & \\
        `@hw\_portX` & \multirow{1}{8cm}{$`\$hw\_clock\_frequency`$} \\
        `...` & \\
        `@hw\_stage` & \multirow{1}{8cm}{$`\$hw\_stage`$: Stage number of script} \\
        \bottomrule
    \end{tabular}
\end{table}
```

## Number Prefixes
By default, hwdbg interprets the numbers as hex (base 16). If you want to specify other forms of a number, you should use MASM prefixes. In all MASM expressions, numeric values are interpreted as numbers in the current radix (16, 10, or 8). You can override the default radix by specifying the `0x` prefix (hexadecimal), the `0n` prefix (decimal), the `0t` prefix (octal), or the `0y` prefix (binary).

## Comments
hwdbg's comments are like C comments. A comment starts with a slash asterisk `/*` and ends with an asterisk slash `*/` and can be anywhere in your program. Comments can span several lines within your C program.


```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
/* comment goes here */
\end{lstlisting}
```

OR

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
/*
 * comment goes here
 */
\end{lstlisting}
```

You can create a comment on a single line.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
// comment goes here
\end{lstlisting}
```

## Escape Characters
Special characters such as `\textbackslash n` and `\textbackslash t`, are used to represent special characters like newline and tab within strings. Additionally, hexadecimal representations between strings, like `\textbackslash x41\textbackslash x42\textbackslash x43`, enable the inclusion of specific byte values in a character sequence.

## Functions

hwdbg supports multiple pre-defined functions. In the first release, the functions shown in the table below are supported. Note that, to make the debugger smaller (utilizing fewer resources), hardware engineers can configure it to remove the support for these functions.

```
\begin{table}[htbp]
\scriptsize
\centering
\caption{Description of Functions and Their Purposes.}
\label{tab:functions}
\begin{tabular}{@{}ll@{}}
\toprule
**Function**         & **Description**                                               \\ \midrule
`printf`           & Send an input message to the debugger                              \\
`hw\_trigger`      & Trigger an event       
\\
`hw\_block\_all`   & Block sending any output (output zero)                        \\
`hw\_unblock\_all` & Unblock sending any output (output valid)                     \\
`hw\_pin\_block`   & Block sending specific pin output (pin output zero)           \\
`hw\_port\_block`  & Block sending specific port output (port output zero)         \\
`hw\_pin\_unblock` & Unblock sending specific pin output (pin output valid)        \\
`hw\_port\_unblock`& Unblock sending specific port output (port output valid)      \\ \bottomrule
\end{tabular}
\end{table}
```

# Hardware Scripting

Here different scripting concepts are discussed.

## Registers Assignment
By using a simple lvalue register assignment, a hardware engineer is able to change the value of each pin (register). 

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
@register = expression;
\end{lstlisting}
```

### Example 1

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
@hw_port2 = 0x55;
\end{lstlisting}
```

### Example 2

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
@hw_port3 = @hw_port2;
\end{lstlisting}
```

### Example 3

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
if (@hw_pin4 == 0x1) {
    @hw_port3 = @hw_port1 & @hw_pin1 + 12;
}
\end{lstlisting}
```

## Local Variables Assignment
In *dslang*, all the variables are defined without **type**, and all of them are considered unsigned 64-bit integers. You can save the results of functions and boolean expressions or results of mathematical calculations alongside 64-bit addresses to the variables.

The variables can be used as input to other functions or might be used in conditional statements. The following example shows the assigning **0** to a variable named `my\_variable`.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
my_variable = 0;
\end{lstlisting}
```

You can also assign registers (pins) or pseudo-registers (ports) to the variables.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
my_variable = @hw_port2 + 0x10;
\end{lstlisting}
```

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
my_variable = @hw_pin2 - @hw_pin12 + 8;
\end{lstlisting}
```

Also, you can assign the results of functions to the variables.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
my_variable = my_function(@hw_port2);
\end{lstlisting}
```

Or, you can decrement or increment variables by one.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
my_variable++;      // equals to my_variable = my_variable + 1;
my_variable--;      // equals to my_variable = my_variable - 1;
\end{lstlisting}
```

## Modify Memory
Modifying memory (BRAM memory) is possible using '**eb**, **ed**, **eq**' functions.

`eb`: modifies a single **byte**.

`ed`: modifies a **dwrod**.

`eq`: modifies a **qword** value.

### Example

The following code edits memory (quad-word) at 0x22 and change it to `0x1234`.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
IsEditApplied = eq(0x22, 0x1234);
\end{lstlisting}
```

## Conditional Statements
Conditional statements are used to perform different actions based on different conditions.

### if
The *if* statement executes some code if one condition is **true**.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
if (condition) {
  code to be executed if condition is true;
}
\end{lstlisting}
```

### Example (if)

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
if (@hw_port3 == 55) {
    printf("The third port is equal to %llx\n", @hw_port3);
}
\end{lstlisting}
```

### else
The *else* statement is executed if the *if* condition is **false**.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
if (condition) {
  code to be executed if condition is true;
}
else {
  if the above condition is false, then else is called;
}
\end{lstlisting}
```

### Example (else)

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
if (@hw_port4 == 55) {
    printf("The 4th port is equal to %llx\n", @hw_port4);
}
else {
    printf("The 4th port is not equal to 0x55, it is equal to %llx\n", @hw_port4);
}
\end{lstlisting}
```

### elsif

Multiple *if...else* statements can be nested to create an *elsif* clause. Note that there is one *elsif* (in one word) keyword in *dslang* script engine.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
if (condition) {
  code to be executed if condition is true;
}
elsif (condition) {
  code to be executed if elsif condition is true;
}
else {
  if none of the above conditions are true, then else is called;
}
\end{lstlisting}
```

### Example (elsif)

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
if (@hw_port5 == 55) {
    printf("@hw_port5 is equal to 0x55\n");
}
elsif (@hw_port5 == 66) {
    printf("@hw_port5 is equal to 0x66\n");
}
elsif (@hw_port5 == 77) {
    printf("@hw_port5 is equal to 0x77\n");
}
else {
    printf("@hw_port5 is not equal to 0x55, 0x66, 0x77. It is equal to %llx\n", @hw_port5);
}
\end{lstlisting}
```

### Loops
At the moment, hardware debugging does not support loops. The absence of loop support stems from the fact that executing loops may require additional clock cycles (stages) to iterate through the scripts. However, this is not feasible because hwdbg directly transfers incoming signals (after the stage delay) to the output without allowing for looping. In certain cases, one can achieve loop behavior by explicitly utilizing consecutive statements.

## Naming convention
Using *snake\_case* as the naming convention is suggested. However, the user can use any other naming conventions as well.

## User-defined Functions
*dslang* functions are defined using the same syntax as the C programming language.

### Function: void
This is an example of a function that does not return any value (*void*). This code defines `my\_func` which prints two integers. It's called with arguments (**1**, **2**). Then, it prints the hexadecimal value of variable `my\_var`, which is **79**.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
  void my_func(int var, int var2) {
    printf("var = %d, var2 = %d\n", var, var2);
    return;
    printf("this statement is never shown!\n");
  }

  //
  // call function
  //
  my_func(1, 2);

  int my_var = 79;
  printf("%x\n", my_var);
\end{lstlisting}
```

### Function: int
This is an example of functions that return an *integer*. This code defines four functions: `my\_func1`, `my\_func2`, `my\_func3`, and `my\_func4`.

`my\_func1`: adds **1** to its argument and prints the result.

`my\_func2`: multiplies its argument by **2** and prints the result.

`my\_func3`: also multiplies its argument by **2** and prints the result.

`my\_func4`: calls `my\_func1`, `my\_func2`, and `my\_func3`, then sums their results and prints the total. 

Finally, it calls `my\_func4` with an argument of **2** and prints the result.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
? {
    
  int my_func1(int var1) {
    result = var1 + 1;
    printf("my_func1 %d\n", result);
    return result;
  }
  
  int my_func2(int var1) {
    result = var1 * 2;
    printf("my_func2 %d\n", result);
    return result;
  }
  
  int my_func3(int var1) {
    result = var1 * 2;
    printf("my_func3 %d\n", result);
    return result;
  }
  
  int my_func4(int var1) {
    result = my_func1(var1) + my_func2(var1) + my_func3(var1);
    printf("my_func4 %d\n", result);
    return result;
  }

  printf("%d\n", my_func4(2));
}
\end{lstlisting}
```

# Extensions \& Arguments

Batch scripts are essential parts of hardware debugging and the script engine and it is mainly used to automate debugging tasks.

Based on the complexity of developing different parts of the debugger and the fact that there are tens of considerations on developing automated tasks in hwdbg, it is preferred to use the script engine to implement many features and commands. That is why hwdbg came with a set of pre-defined scripts. 

Hardware engineers can write their own scripts to automate debugging routines without worrying about hwdbg internals, as most limitations are checked through the script functions.

Hardware engineers can use plain text files for batch scripts, but as the convention, hwdbg uses (**.ds**) extensions, the abbreviation of **D**ebugger **S**cript.

Arguments are passed to the scripts by using the `\$arg0`, `\$arg1`, `\$arg2`, ..., `\$arg100`, ..., `\$arg1000` and so on.

The first argument (`\$arg0`) is the script's **.ds** file path. Arguments can be both an expression, a constant, or a string. Constants are considered in hex format if no prefix is specified.