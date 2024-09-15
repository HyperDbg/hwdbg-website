---
sidebar_position: 12
---

# User-defined Functions
*dslang* functions are defined using the same syntax as the C programming language.

## Naming convention
Using *snake\_case* as the naming convention is suggested. However, the user can use any other naming conventions as well.

### Function: void
This is an example of a function that does not return any value (*void*). This code defines `my\_func` which prints two integers. It's called with arguments (**1**, **2**). Then, it prints the hexadecimal value of variable `my\_var`, which is **79**.

```
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
```

### Function: int
This is an example of functions that return an *integer*. This code defines four functions: `my\_func1`, `my\_func2`, `my\_func3`, and `my\_func4`.

`my\_func1`: adds **1** to its argument and prints the result.

`my\_func2`: multiplies its argument by **2** and prints the result.

`my\_func3`: also multiplies its argument by **2** and prints the result.

`my\_func4`: calls `my\_func1`, `my\_func2`, and `my\_func3`, then sums their results and prints the total. 

Finally, it calls `my\_func4` with an argument of **2** and prints the result.

```
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
```