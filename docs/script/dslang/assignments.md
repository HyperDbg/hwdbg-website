---
sidebar_position: 9
---

# Assignments

By using a simple lvalue register assignment, a hardware engineer is able to change the value of each pin (register). 

```
@register = expression;
```

### Example 1

```
@hw_port2 = 0x55;
```

### Example 2

```
@hw_port3 = @hw_port2;
```

### Example 3

```
if (@hw_pin4 == 0x1) {
    @hw_port3 = @hw_port1 & @hw_pin1 + 12;
}
```

## Local Variables Assignment
In *dslang*, all the variables are defined without **type**, and all of them are considered unsigned 64-bit integers. You can save the results of functions and boolean expressions or results of mathematical calculations alongside 64-bit addresses to the variables.

The variables can be used as input to other functions or might be used in conditional statements. The following example shows the assigning **0** to a variable named `my\_variable`.

```
my_variable = 0;
```

You can also assign registers (pins) or pseudo-registers (ports) to the variables.

```
my_variable = @hw_port2 + 0x10;
```

```
my_variable = @hw_pin2 - @hw_pin12 + 8;
```

Also, you can assign the results of functions to the variables.

```
my_variable = my_function(@hw_port2);
```

Or, you can decrement or increment variables by one.

```
my_variable++;      // equals to my_variable = my_variable + 1;
my_variable--;      // equals to my_variable = my_variable - 1;
```

## Modify Memory
Modifying memory (BRAM memory) is possible using '**eb**, **ed**, **eq**' functions.

`eb`: modifies a single **byte**.

`ed`: modifies a **dwrod**.

`eq`: modifies a **qword** value.

### Example

The following code edits memory (quad-word) at 0x22 and change it to `0x1234`.

```
IsEditApplied = eq(0x22, 0x1234);
```