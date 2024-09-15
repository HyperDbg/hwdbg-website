---
sidebar_position: 2
---

# Debugging Input/Output Pins

There are five divisions of pins in hwdbg.

- **Chip pins**: Contains the clock signal [*clock*], reset [*reset*], and chip enable [*io\_en*] all as inputs
- **Interrupt lines**: Contains [*io\_plInSignal*] as PS to PL signal input, and [*io\_psOutInterrupt*] as PL to PS interrupt output
- **BRAM ports**: Contains [*io\_rdData*] as read data input, [*io\_rdWrAddr*] as read/write address output, [*io\_wrEna*] as enable writing, and [*io\_wrData*] as write data all as output
- **Input pins**: Contains [*io\_inputPin0...n*] as input pins
- **Output pins**: Contains [*io\_outputPin0..n*] as output pins

These pins are also illustrated in figure below.

![Input/Output Pins in hwdbg.](/img/figures/chip-in-out.jpg)

| **Division**        | **Pin**                        | **Description**                          |
|---------------------|--------------------------------|------------------------------------------|
| Chip Pins           | clock, reset, io\_en           | Clock signal (input), Reset signal (input), Chip enable signal (input) |
| Interrupt Lines     | io\_plInSignal, io\_psOutInterrupt | PS to PL signal (input), PL to PS interrupt (output) |
| BRAM Ports          | io\_rdData, io\_rdWrAddr, io\_wrEna, io\_wrData | Read data (input), Read/write address (output), Enable writing (output), Write data (output) |
| Input Pins          | io\_inputPin0...n (customizable) | Input pins (input)                       |
| Output Pins         | io\_outputPin0...n (customizable) | Output pins (output)                     |
