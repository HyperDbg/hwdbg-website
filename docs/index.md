---
sidebar_position: 1
---

# hwdbg

The **hwdbg** debugger chip generator is a gate-level debugging tool designed to make configurable and synthesizable hardware debuggers for white-box and black-box chip fuzzing, testing, and reverse engineering. The primary goal of **hwdbg** is to provide control over hardware, enabling monitoring and modification of signals down to the granular level of a single clock cycle. It is written in Chisel and Verilog.

```
            ┏━━━━━━━━━━━━━━━━━━━━━━━┓
     _             _  _             ┃
    | |_  _ _ _  _| || |_  ___      ┃
    | . || | | |/ . || . \/ . |     ┃
    |_|_||__/_/ \___||___/\_. |     ┃
                          <___'     ┃
                                    ┃      ╱|、
  HyperDbg's chip-level debugger    ┃     (˚ˎ 。7
                                    ┃     |、 ˜〵
            ┗━━━━━━━━━━━━━━━━━━━━━━━┛     じしˍ,)ノ
```

**hwdbg** is a highly customizable debugger designed to ease hardware debugging by bringing software debugging concepts into the hardware debugging domain. **hwdbg** aims to help with the complexities associated with debugging hardware, including chips and IP cores. Key features of **hwdbg** include the ability to step through the hardware design at the clock-cycle level, visualize waveforms, inspect values (e.g., like a logical analyzer), and modify signals. Moreover, it is synthesizable into [FPGAs](https://github.com/HyperDbg/hwdbg-fpga) and has the potential for fabrication into physical chips.