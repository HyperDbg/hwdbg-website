---
sidebar_position: 4
---

# Registers & Pseudo-registers

Here are the current registers and pseudo-registers supported by the script engine (See Table below). Note that registers (pins) start with '`@`' and pseudo-registers (ports) start with '`\$`'.

| **Registers**    | **Pseudo-registers**                                                                 |
|------------------|--------------------------------------------------------------------------------------|
| `@hw_pin0`       | `$hw_clk`, or `$hw_clock`: 1 or 0                                                    |
| `@hw_pin1`       |                                                                                      |
| `...`            |                                                                                      |
| `@hw_pinX`       |                                                                                      |
| `@hw_port0`      | `$hw_counter`, and `$hw_clock_edge_counter`                                           |
| `@hw_port1`      |                                                                                      |
| `...`            |                                                                                      |
| `@hw_portX`      | `$hw_clock_frequency`                                                                |
| `...`            |                                                                                      |
| `@hw_stage`      | `$hw_stage`: Stage number of script                                                  |
