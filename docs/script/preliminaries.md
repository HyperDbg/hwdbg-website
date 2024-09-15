---
sidebar_position: 1
---

# Preliminaries
This section discusses the debugger script language implemented in hwdbg.

# Parsing Custom Scripts

The script engine of the hwdbg consists of a back-end utilizing LL(1) and LALR(1) parsers for optimal efficiency, and a front-end employing a MASM Style syntax with C keywords (such as if, else, for) along with a customizable grammar. 

User-inputted scripts are parsed in either the PS or an external processor and then directed to the PL. These scripts are scanned by a lexer and parsed into an Intermediate Representation (IR), which is then transmitted via the shared Block RAM over the AXI interface into the PL for execution. Subsequently, a buffer is incrementally populated with the execution results and sent back to the PS using the same shared BRAM. This approach yields significant debugging capabilities and enhancements compared to conventional logic analyzers like Xilinx Integrated Logic Analyzer (ILA) and other methods used in commodity logic analyzers, where commands and scripts are much simpler and with less flexibility. Once the IR is ready, the entire script (IR) is sent into the PL, and the response is transmitted back into the PS, creating a unidirectional flow.

It is also feasible to designate a script as the action of an event. In this scenario, the parsed IR script is stored in the BRAM. Upon the triggering of a corresponding event, the IR is executed locally by PL, thereby enhancing the execution performance of the script engine.


# Co-Design of Software Interpretation and Hardware Execution

The interpretation and execution module for user-defined scripts is implemented in separate stages. First, a software-based interpretation engine reads the user-defined scripts and produces a custom Intermediate Representation (IR). This software can run either on the FPGA's Processing System (PS) or on any PC running the debugger. Once the IR is generated, it is sent to the debuggee for hardware-level evaluation.

The evaluation is conducted in the Programmable Logic (PL) rather than the PS because hwdbg must support real-time signal evaluation and perform checks against the user script in every clock cycle. Due to potential slow communication between the PL and PS, the script execution engine is implemented in the hardware (PL) to ensure efficient and timely performance.

# Configure Port Adjustments

Upon generating the debugger hardware, the user is able to specify the exact **pin** and **port** configuration. Each **pin** is considered a single input wire (in VHDL `STD\_LOGIC`), while each **port** consists of multiple pins grouped together to form a meaningful value (in VHDL `STD\_LOGIC\_VECTOR`). Once the configuration is done, the generated debugger contains registers (refers to pins) and pseudo-registers (refers to ports). These pins and ports are accessible through custom script expressions.