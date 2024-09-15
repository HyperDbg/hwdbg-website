---
sidebar_position: 5
---

# Number Prefixes

By default, hwdbg interprets the numbers as hex (base 16). If you want to specify other forms of a number, you should use MASM prefixes. In all MASM expressions, numeric values are interpreted as numbers in the current radix (16, 10, or 8). You can override the default radix by specifying the `0x` prefix (hexadecimal), the `0n` prefix (decimal), the `0t` prefix (octal), or the `0y` prefix (binary).