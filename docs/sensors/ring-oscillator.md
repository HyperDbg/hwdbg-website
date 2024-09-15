---
sidebar_position: 2
---

# Ring Oscillator (RO)

A ring oscillator is a type of electronic oscillator consisting of an **odd number of inverters** connected in a loop. It generates a periodic oscillating signal by continuously switching states, creating a sequence of voltage pulses. The frequency of this oscillation is influenced by factors such as voltage, temperature, and the manufacturing process, making ring oscillators useful for detecting variations in these parameters. The following figure illustrates a ring oscillator with an odd number of stages.

![An Illustration of a Ring Oscillator (RO). (Source: https://analogcircuitdesign.com/ring-oscillator/)](/img/figures/ring-oscillator.png)

A ring oscillator module is embedded in hwdbg. It 
 involves a circuit with an odd number of inverters. These circuits are often embedded in IP cores and the oscillation result is integrated with hardware debuggers to provide real-time frequency data, helping engineers and security researchers monitor and adjust system state accordingly. These sensors can help detect changes in operating conditions that might affect the performance and reliability of microchips and IP cores.
