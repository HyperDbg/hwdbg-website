# The Proposed Hardware Debugger Design
Here, the design consideration for different components of hwdbg is discussed.


# Motivation for the Design

The design of the debugger was driven by the need to address specific limitations in existing systems especially based on the constraints imposed in Xilinx FPGAs. The primary objective was to create a robust and efficient solution capable of handling high throughput while maintaining low latency to make hwdbg capable of handling signals with a high rate of frequency. Additionally, the design aimed to enhance scalability and reliability to meet the demands of modern hardware. By addressing these goals, the design seeks to bridge the gap between current capabilities and the evolving requirements of the industry.

# Challenges and Solutions

During the design process, we encountered several significant challenges. One of the primary difficulties was ensuring the system's ability to scale efficiently without compromising performance. To address this, we implemented a modular architecture that allows for seamless scaling by adding or removing components as needed. Another challenge was maintaining data consistency and integrity across PS/PL and possible external debugger. We overcame this by incorporating advanced synchronization mechanisms and error-checking protocols.

Several key design decisions were made to optimize the system's performance and reliability. For instance, we chose a microservices architecture over a monolithic approach to enhance scalability and maintainability. This decision was based on the need for flexibility in deploying and updating individual components without affecting the entire system. In the coming sections, the design constraints and decisions of hwdbg are discussed.

# Debugging Input/Output Pins

There are five divisions of pins in hwdbg.

- **Chip pins**: Contains the clock signal [*clock*], reset [*reset*], and chip enable [*io\_en*] all as inputs
- **Interrupt lines**: Contains [*io\_plInSignal*] as PS to PL signal input, and [*io\_psOutInterrupt*] as PL to PS interrupt output
- **BRAM ports**: Contains [*io\_rdData*] as read data input, [*io\_rdWrAddr*] as read/write address output, [*io\_wrEna*] as enable writing, and [*io\_wrData*] as write data all as output
- **Input pins**: Contains [*io\_inputPin0...n*] as input pins
- **Output pins**: Contains [*io\_outputPin0..n*] as output pins

These pins are also illustrated in Figure below.

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.89\linewidth]{Figures/chip-in-out.pdf}
    \caption{Input/Output Pins in hwdbg.}
    \label{fig:inout_chip_hwdbg}
\end{figure}
```

```
\begin{table}[htbp]
    \centering
    \caption{Description of Pin Divisions.}
    \label{tab:pin_divisions}
    \begin{tabular}{@{}llp{6cm}@{}}
    \toprule
    **\footnotesize Division** & **\footnotesize	Pin** & **\footnotesize Description** \\ 
    \midrule
    \footnotesize Chip Pins & 
    \begin{tabular}[t]{@{}l@{}}
    \footnotesize clock \\ 
    \footnotesize reset \\ 
    \footnotesize io\_en \\
    \end{tabular} & 
    \begin{tabular}[t]{@{}p{6cm}@{}}
    \footnotesize Clock signal (input) \\ 
    \footnotesize Reset signal (input) \\ 
    \footnotesize Chip enable signal (input) \\
    \end{tabular} \\ 
    \midrule
    \footnotesize Interrupt Lines & 
    \begin{tabular}[t]{@{}l@{}}
    \footnotesize io\_plInSignal \\ 
    \footnotesize io\_psOutInterrupt \\
    \end{tabular} & 
    \begin{tabular}[t]{@{}p{6cm}@{}}
    \footnotesize PS to PL signal (input) \\ 
    \footnotesize PL to PS interrupt (output) \\
    \end{tabular} \\ 
    \midrule
    \footnotesize BRAM Ports & 
    \begin{tabular}[t]{@{}l@{}}
    \footnotesize io\_rdData \\ 
    \footnotesize io\_rdWrAddr \\ 
    \footnotesize io\_wrEna \\ 
    \footnotesize io\_wrData \\
    \end{tabular} & 
    \begin{tabular}[t]{@{}p{6cm}@{}}
    \footnotesize Read data (input) \\ 
    \footnotesize Read/write address (output) \\ 
    \footnotesize Enable writing (output) \\ 
    \footnotesize Write data (output) \\
    \end{tabular} \\ 
    \midrule
    \multirow{2}{*}{\footnotesize Input Pins} & \footnotesize io\_inputPin0...n & \multirow{2}{*}{\footnotesize Input pins (input)} \\
    & \footnotesize (customizable) & \\
    \midrule
    \multirow{2}{*}{\footnotesize Output Pins} & \footnotesize io\_outputPin0...n & \multirow{2}{*}{\footnotesize Output pins (output)} \\
    & \footnotesize (customizable) & \\
    \bottomrule
    \end{tabular}
\end{table}
```

# Design Flow

Figure below shows the flowchart of hwdbg from design to the bitstream generation for FPGA implementation. It starts with HDL code, which can be written in Verilog (.SV) or SystemVerilog (.V). This code is then synthesized by Xilinx Vivado into an RTL netlist (.rtl).

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.45\linewidth]{Figures/tool.pdf}
    \caption{The High-level View of hwdbg Hardware Generator for FPGA/ASIC Design.~\cite{gorgin2024hardware}}
    \label{fig:flowchart_of_design}
\end{figure}
```

Next, the RTL netlist is simulated using a simulator like ModelSim`~\cite{ModelSim}`. This simulation helps to ensure that the design is functioning as expected. After simulation, the design is translated into a bitstream file (.bit) using Vivado`~\cite{VivadoX}`. This bitstream file is then loaded onto the FPGA development board.

The FPGA development board contains a programmable logic device (PLD) that can be configured to implement the design. The bitstream file tells the PLD how to connect its internal logic blocks to implement the desired functionality.

The FPGA development board also includes a processor system (PS) that can be used to control the PLD. The PS and PLD can communicate with each other through a shared channel. The PS can also communicate with the outside world through the chip pins.

# Raw Shared Channel Project for Testing Artifacts

For testing artifacts, a shared PS \<\> PL project has been written to create a channel between the PS and the PL by sharing an 8 KB (can be customized) Block RAM (BRAM) as well as an interrupt line from PL to PS, and a GPIO line from PS to PL. The BRAM is made accessible for both PS and PL communication (See Section `\ref{sec:bram_sim}`). The following figure depicts the high-level design of the PS \<\> PL shared channel in Vivado. \\

```
%\begin{figure}[ht]
%    \centering
%    \hspace*{-1.1cm}
%    \includegraphics[width=1.1\linewidth]{Figures/ps_pl_shared_design_view.pdf}
%    \caption{The Block Design of PS <> PL Communication Channel}
%    \label{fig:block_design_ps_pl}
%\end{figure}
```

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.7\linewidth]{Figures/ps_pl_shared_channel.pdf}
    \caption{High-level Overview of PS <> PL Communication Over AXI Bus.}
    \label{fig:overview_of_ps_pl_communication}
\end{figure}
```

# Communication Protocols

The communication protocol follows a packet-based design between sender and receiver. These packets contain special mandatory headers to check for the integrity of the packet and prevent communication errors as well as specifying which component in the debugger/debuggee is responsible for handling the receiving packet and the corresponding action. To achieve this, a communication protocol is designed, similar to the one used in __HyperDbg__, enabling data exchange through shared memory.

For the communication between PL and PS, the following structure is used.

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.9\linewidth]{Figures/packet_memory.png}
    \caption{The Format of Action Request Packets from PS <> PL Communication.}
    \label{fig:structure_coomunication}
\end{figure}
```

This design uses four mandatory fields. The first is the `checksum` of the incoming/outgoing packet primarily used for checking whether the packet is modified communication problems. The second field is the `indicator` of the packet which is used to identify that the packet is related to a HyperDbg-compatible interpreter. The following table shows an example of a valid indicator.

```
\begin{table}[htbp]
    \centering
    \scriptsize
    \caption{HyperDbg Packet Indicator Constant.}
    \label{tab:hyperdbg_constants}
    \begin{tabular}{@{}ll@{}}
        \toprule
        **Constant Name** & **Value** \\
        \midrule
        INDICATOR\_OF\_HYPERDBG\_PACKET & 0x4859504552444247 \\
        \bottomrule
    \end{tabular}
\end{table}
```

The third field is `TypeOfThePacket`. Two exclusive packet types are owned by hwdbg for sending data from debugger (PS) to debugged (PL) and from debuggee (PL) to debugger (PS).

```
\begin{table}[htbp]
    \centering
    \scriptsize
    \caption{Packet Types in HyperDbg.}
    \label{tab:packet_types}
    \begin{tabular}{@{}ll@{}}
        \toprule
        **Packet Type** & **Description** \\
        \midrule
        DEBUGGER\_TO\_DEBUGGEE\_EXECUTE\_ON\_VMX\_ROOT & Debugger to debuggee (VMX-root) \\
        DEBUGGER\_TO\_DEBUGGEE\_EXECUTE\_ON\_USER\_MODE & Debugger to debuggee (user-mode) \\
        DEBUGGEE\_TO\_DEBUGGER & Debuggee to debugger (user/kernel \& VMX-root) \\
        DEBUGGER\_TO\_DEBUGGEE\_HARDWARE\_LEVEL & Debugger to debuggee (hardware), used in hwdbg \\
        DEBUGGEE\_TO\_DEBUGGER\_HARDWARE\_LEVEL & Debuggee to debugger (hardware), used in hwdbg \\
        \bottomrule
    \end{tabular}
\end{table}
```

The communication structure is synchronized between hwdbg (written in Scala) and __HyperDbg__ (written in C) and it is demonstrated as follows:

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
/**
 * @brief The structure of remote packets in HyperDbg
 *
 */
typedef struct _DEBUGGER_REMOTE_PACKET
{
    BYTE                                    Checksum;
    UINT64                                  Indicator; /* Shows the type of the packet */
    DEBUGGER_REMOTE_PACKET_TYPE             TypeOfThePacket;
    DEBUGGER_REMOTE_PACKET_REQUESTED_ACTION RequestedActionOfThePacket;
} DEBUGGER_REMOTE_PACKET, *PDEBUGGER_REMOTE_PACKET;
\end{lstlisting}
```

# Main Communication Modules

There are 4 Main Communication Modules in hwdbg:

- Sending Module
- Receiving Module
- The Sender/Receiver Synchronization Module
- item Interpreting Module

Since there is only one port shared with PS and PL has only one port to the BlockRAM, hwdbg cannot simultaneously read/write to the BlockRAM. Thus, the above modules are designed to handle these situations to avoid simultaneous sending and receiving, which can cause data corruption and invalid data in the BlockRAM. Once valid data is received, the interpreter module attempts to interpret the packet and may also send data as a result of interpretation.


## Sending Module

This module is responsible for transmitting data from the hardware debugger (hwdbg) or the Programmable Logic (PL) to the Processor System (PS). It handles the process of packaging the data into packets suitable for transmission and sending them out through the designated port. Additionally, it adds different headers and manages any necessary handshaking protocols, and adjusts mandatory fields to ensure successful data transmission.

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.9\linewidth]{Figures/sending_data_fsm.pdf}
    \caption{The FSM of How Sending Module Works.}
    \label{fig:sending_data_fsm}
\end{figure}
```

This module ensures the orderly and correct transmission of data from the module to the designated receiver. The state machine of the module begins in the `sIdle` state, where it initializes key variables and awaits the signal to begin sending data (`beginSendingBuffer = 1`). Once this signal is received, the sender module transitions to the `sWriteChecksum` state, where it writes the checksum offset and initializes the data transfer process.

Next, to prepare headers it moves to various states such as `sWriteIndicator`, `sWriteTypeOfThePacket`, and `sWriteRequestedActionOfThePacket`. In these states, the module writes specific pieces of data to designated addresses, preparing the data packet for transmission. When there is no new header data to send, the FSM transitions to the `sWaitToGetData` state, where it awaits the arrival of valid data (`dataValidInput = 1`). Once valid data is received, the FSM moves to the `sSendData` state, where the actual data transmission occurs. If no more data is available (`noNewDataSender = 1`), the FSM transitions to the `sDone` state, signaling the completion of the sending process (`finishedSendingBuffer = 1`) and setting the interrupt for the processor system (`psOutInterrupt = 1`). This module ensures data is sent accurately, avoiding conflicts and maintaining the integrity of the data in the BlockRAM.

## Receiving Module

The receiving module is responsible for capturing incoming data from PS and passing it to the hwdbg for further processing. It monitors the designated port (PS to PL shared line) for incoming data packets, retrieves them, checks for validity, and forwards them to the appropriate components within the debugger for interpretation or storage.

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.9\linewidth]{Figures/receiver_fsm.pdf}
    \caption{The FSM of How Receiving Module Works.}
    \label{fig:receiver_fsm}
\end{figure}
```

The above figure depicts the Moore FSM of the receiving module for the sequence of operations required to process incoming data packets. The process begins in the `sIdle` state, where the module awaits a valid signal (`pllInSignal = 1`) to transition to the next states for reading packet data. Upon receiving the signal, the FSM moves to `sReadChecksum` to verify the integrity of the data packet by reading the checksum from the specified offset. Following a successful checksum read, the FSM transitions to `sReadIndicator` to read an indicator value that determines the type of packet being processed.

The FSM proceeds to the `sReadTypeOfThePacket` state, where it identifies the packet type. Depending on the validity of the indicator, the FSM either moves to `sReadRequestedActionOfThePacket` to fetch the specific action requested by the packet or reverts to the `sIdle` state if the indicator is invalid. Valid packets lead to the `sRequestedActionIsValid` state, where the requested action is confirmed, and the address for reading the next data is set. The FSM then cycles through states such as `sReadActionBuffer` and `sWaitToReadActionBuffer`, handling the data reception and buffering process. The cycle continues until all data is read, eventually transitioning to the `sDone` state, indicating the data reception's completion.

## The Sender/Receiver Synchronization Module

This module plays a crucial role in ensuring that the sending and receiving operations within the hwdbg occur without conflicts. It manages the timing and coordination between the sending and receiving modules, preventing them from attempting to access the shared resources simultaneously. Other than that, based on the fact that Xilinx FPGAs are manufactured with BRAMs with two ports, one port is shared with PS, and the other one is shared with PL, thus, no two modules (in PL) can use a single port simultaneously. By enforcing synchronization, this module helps prevent data corruption between multiple modules (in PL) and ensures the integrity of communications between the debugger and the PL/PS.

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.9\linewidth]{Figures/send_receive_data_synchronizer_fsm.pdf}
    \caption{The FSM of How Sender/Receiver Synchronization Module Works.}
    \label{fig:send_receive_data_synchronizer_fsm}
\end{figure}
```

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=1\linewidth]{Figures/wavedrom-synch-module.pdf}
    \caption{The Wave Demonstration of How Sender/Receiver Synchronization Module Works.}
    \label{fig:send_receive_data_synchronizer_wave}
\end{figure}
```

The diagram illustrates the Moore FSM and the figure is the waveform of the synchronizer module in the hwdbg hardware debugger, responsible for coordinating the sending and receiving of data. The FSM begins in the `sIdle` state, where all control signals (`wrEna`, `rdWrAddr`, `wrData`, `rdData`) are initialized to zero, awaiting a trigger to commence data operations. When the `pllInSignal` is asserted (`pllInSignal = 1`), the FSM transitions to the `sReceiver` state, where it performs data reading tasks. In this state, the address for reading is set (`rdWrAddr = requested addr`), and the data to be read is managed. The module remains in `sReceiver` until the `finishedReceivingBuffer` signal is set, indicating that the data reception process is complete.

Following the reception, the FSM moves back to the `sIdle` state until conditions for sending data are met (`beginSendingData = 1` and `pllInSignal = 0`). Once these conditions are satisfied, the FSM transitions to the `sSender` state. In `sSender`, the module is configured to enable writing (`wrEna = sender value`), set the address for writing (`rdWrAddr = requested addr`), and prepare the data to be written (`wrData = Data to Write`). The FSM remains in this state until the `finishedSendingBuffer` signal is asserted, which marks the completion of the data transmission. Finally, the FSM returns to the `sIdle` state, ready for the next cycle of operations. This synchronized process ensures efficient and orderly data handling, maintaining the integrity and reliability of data transactions within the hardware debugger. Note that in hwdbg, receiving command precedes sending data.

## Interpreting Module

Once valid data is received from either the PS, the interpreting module takes charge of analyzing the incoming packets. It decodes the received data, interprets its meaning or purpose, and triggers any necessary actions or responses within the hwdbg. This module involves parsing incoming commands, executing debugging operations, or generating responses to be sent back to the PS.

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=0.9\linewidth]{Figures/interpreter_fsm.pdf}
    \caption{The FSM of How Interpreter Module Works.}
    \label{fig:interpreter_fsm}
\end{figure}
```

The diagram (See Figure `\ref{fig:interpreter_fsm}`) illustrates the Moore FSM and Figure `\ref{fig:interpreter_wave}` demonstrates the waveform of the interpreter module of the hwdbg hardware debugger. This module is designed to process incoming data packets and generate appropriate responses based on the actions requested by these packets. Initially, the FSM is in the `sIdle` state, where it remains until a valid packet input is received from the receiver module (`requestedActionOfThePacketInputValid = 1`). In this state, no new data is being received or sent by the interpreter (`noNewDataReceiver = 0`, `noNewDataSender = 0`).

```
\begin{figure}[ht]
    \centering
    \includegraphics[width=1\linewidth]{Figures/wavedrom-interpreter.pdf}
    \caption{The Wave Demonstration of How Interpreter Module Works.}
    \label{fig:interpreter_wave}
\end{figure}
```

Upon detecting a valid packet input, the FSM transitions to the receiving (`sNewActionReceived`) state. Here, the module interprets the requested action and prepares the response (`requestedActionOfThePacketOutput = adequate response`). If the action is invalid, an error flag (`lastError = if invalid action received`) is set. After processing the action, the FSM moves to the `sSendResponse` state, where it prepares to send the response data. In this state, the module sets signals indicating it is ready to send data (`noNewDataReceiver = 1`, `beginSendingBuffer = 1`) and the data to be sent is made available (`sendingData = module data`). If further synchronization is required, the FSM ensures that the data is valid and waits for the buffer to be ready (`sendWaitForBuffer = 0`).

Once the response data has been sent, the current FSM transitions to the `sDone` state, where it updates the read/write address (`rdWrAddr = type of packet offset`) and signals that the receiving and sending processes are complete (`noNewDataReceiver = 1`, `noNewDataSender = 1`). Finally, the FSM returns to the `sIdle` state, ready to process the next incoming packet.

# BlockRAM (BRAM) Simulator
To test and debug the hwdbg effectively, a BlockRAM simulator module was developed, filled with sample testing data from a file. As the Chisel language`~\cite{bachrach2012chisel}` does not directly support BlockRAM components, despite its support for SRAM modules, an 8 KB flip-flop module was created to simulate the behavior of BlockRAM. At the moment 8 KB was proved to be enough to support most of the hwdbg tasks. This module features input/output ports similar to those of Xilinx FPGA BlockRAMs, ensuring compatibility and accurate simulation. The delay characteristics of the BlockRAM were also emulated which allows the testing module to initialize the flip-flops with test data sent from the PS to PL.

In the simulation, the first half of the BlockRAM is dedicated to buffers for data transfer from PS to PL, while the second half is reserved for data transfer from PL to PS. The BlockRAM is divided into two halves to ensure that both the PL and PS do not simultaneously overwrite each other's buffer. During execution, the testing module initializes the flip-flops with test data, simulating the conditions of actual hardware interactions. After the debugger completes its operations, the second half of the BlockRAM is filled with the output data generated by the PL.

To verify the functionality and correctness of the hwdbg, the data in the BlockRAM is displayed and written to a file post-execution. This data is then interpreted based on the communication protocol, with each field's value being shown and separated for clarity. The simulation was executed using cocotb`~\cite{cocotb}`, with Verilator `\cite{verilator}` and Icarus`~\cite{icarus}` serving as the backend tools. This comprehensive testing framework not only validates the hwdbg but also provides insights into the communication and data handling processes.

The following listing is an example of PS/PL shared BlockRAM contents shown in the BRAM simulator.

```
\begin{lstlisting}[basicstyle=\small\ttfamily,lineskip=-0.1ex]
Number of clock cycles spent in debuggee (PL): 0
Number of clock cycles spent in debuggee (PL): 10
Number of clock cycles spent in debuggee (PL): 20
Debuggee (PL) interrupted Debugger (PS)
===============================
Content of BRAM after emulation:
Address of PL to PS communication: mem_128

PS to PL area:
mem_0:   00000000   | Checksum
mem_1:   00000000   | Checksum
mem_2:   52444247   | Indicator
mem_3:   48595045   | Indicator
mem_4:   00000004   | TypeOfThePacket
mem_5:   00000002   | RequestedActionOfThePacket
mem_6:   00000000   | Start of Optional Data
mem_7:   00000000
...

PL to PS area:
mem_128: 00000000   | Checksum
mem_129: 00000000   | Checksum
mem_130: 52444247   | Indicator
mem_131: 48595045   | Indicator
mem_132: 00000005   | TypeOfThePacket
mem_133: 00000003   | RequestedActionOfThePacket
mem_134: 00000003   | Start of Optional Data
mem_135: 0000000c
mem_136: 00000009
mem_137: 0000000b
mem_138: 00000000
...
\end{lstlisting}
```