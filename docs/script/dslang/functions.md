---
sidebar_position: 8
---

# Functions

hwdbg supports multiple pre-defined functions. In the first release, the functions shown in the table below are supported. Note that, to make the debugger smaller (utilizing fewer resources), hardware engineers can configure it to remove the support for these functions.

| **Function**        | **Description**                                            |
|---------------------|------------------------------------------------------------|
| `printf`            | Send an input message to the debugger                      |
| `hw_trigger`        | Trigger an event                                           |
| `hw_block_all`      | Block sending any output (output zero)                     |
| `hw_unblock_all`    | Unblock sending any output (output valid)                  |
| `hw_pin_block`      | Block sending specific pin output (pin output zero)        |
| `hw_port_block`     | Block sending specific port output (port output zero)      |
| `hw_pin_unblock`    | Unblock sending specific pin output (pin output valid)     |
| `hw_port_unblock`   | Unblock sending specific port output (port output valid)   |
