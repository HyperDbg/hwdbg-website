---
sidebar_position: 3
---

# Design Flow

Figure below shows the flowchart of hwdbg from design to the bitstream generation for FPGA implementation. It starts with HDL code, which can be written in Verilog (.SV) or SystemVerilog (.V). This code is then synthesized by Xilinx Vivado into an RTL netlist (.rtl).

![The High-level View of hwdbg Hardware Generator for FPGA/ASIC Design. (Source: https://www.mdpi.com/2079-9292/13/4/690)](/img/figures/high-level-hardware-stack.jpg)

Next, the RTL netlist is simulated using a simulator like [ModelSim](https://www.intel.com/content/www/us/en/software-kit/750368/modelsim-intel-fpgas-standard-edition-software-version-18-1.html/). This simulation helps to ensure that the design is functioning as expected. After simulation, the design is translated into a bitstream file (.bit) using [Vivado](https://www.xilinx.com/products/design-tools/vivado.html). This bitstream file is then loaded onto the FPGA development board.

The FPGA development board contains a programmable logic device (PLD) that can be configured to implement the design. The bitstream file tells the PLD how to connect its internal logic blocks to implement the desired functionality.

The FPGA development board also includes a processor system (PS) that can be used to control the PLD. The PS and PLD can communicate with each other through a shared channel. The PS can also communicate with the outside world through the chip pins.