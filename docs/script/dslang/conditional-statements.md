---
sidebar_position: 10
---

# Conditional Statements

Conditional statements are used to perform different actions based on different conditions.

### if
The *if* statement executes some code if one condition is **true**.

```
if (condition) {
  code to be executed if condition is true;
}
```

### Example (if)

```
if (@hw_port3 == 55) {
    printf("The third port is equal to %llx\n", @hw_port3);
}
```

### else
The *else* statement is executed if the *if* condition is **false**.

```
if (condition) {
  code to be executed if condition is true;
}
else {
  if the above condition is false, then else is called;
}
```

### Example (else)

```
if (@hw_port4 == 55) {
    printf("The 4th port is equal to %llx\n", @hw_port4);
}
else {
    printf("The 4th port is not equal to 0x55, it is equal to %llx\n", @hw_port4);
}
```

### elsif

Multiple *if...else* statements can be nested to create an *elsif* clause. Note that there is one *elsif* (in one word) keyword in *dslang* script engine.

```
if (condition) {
  code to be executed if condition is true;
}
elsif (condition) {
  code to be executed if elsif condition is true;
}
else {
  if none of the above conditions are true, then else is called;
}
```

### Example (elsif)

```
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
```