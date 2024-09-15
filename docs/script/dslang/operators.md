---
sidebar_position: 3
---

# Operators

Multiple operators are supported in hwdbg. Note that operators like **multiplication**, **division**, and **modulus** are disabled by default since these operators negatively influence the critical path and decrease the overall supported clock speed. The user might enable these operators by manually configuring the chip generator.

### Operators Precedence/Priority (Expressions)

Operator precedence in normal expressions (assignments) is shown in Table below.

| **Operators**                | **Description**                                                |
|------------------------------|----------------------------------------------------------------|
| ()                           | Parentheses                                                    |
| -+ ~ * &                     | Unary Operators (Unary negative, Unary positive, Bitwise not, Reference, Address of) |
| / % *                        | Arithmetic Operators (Division, Modulo, Multiplication)        |
| +-                           | Arithmetic Operators (Addition, Subtraction)                  |
| \<\< \>\>                        | Shift Operators (Right shift, Left shift)                     |
| &                            | Bitwise AND Operator                                           |
| ^                            | Bitwise XOR Operator (exclusive OR)                           |
| \|                           | Bitwise OR Operator                                            |

### Operator Precedence/Priority (Boolean Expressions)
The following table shows operator precedence in boolean expressions.

| **Operators**                | **Description**                                                |
|------------------------------|----------------------------------------------------------------|
| ()                           | Parentheses                                                    |
| -+ ~ * &                     | Unary Operators (Unary negative, Unary positive, Bitwise not, Reference, Address of) |
| / % *                        | Arithmetic Operators (Division, Modulo, Multiplication)        |
| +-                           | Arithmetic Operators (Addition, Subtraction)                  |
| \<\< \>\>                        | Shift Operators (Right shift, Left shift)                     |
| \>= \< \> \<= == !=              | Comparison operators                                           |
| &                            | Bitwise AND Operator                                           |
| ^                            | Bitwise XOR Operator (exclusive OR)                           |
| \|                           | Bitwise OR Operator                                            |
| &&                           | Logical AND                                                    |
| \|\|                         | Logical OR                                                     |
