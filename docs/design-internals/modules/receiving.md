---
sidebar_position: 2
---

# Receiving Module

The receiving module is responsible for capturing incoming data from PS and passing it to the hwdbg for further processing. It monitors the designated port (PS to PL shared line) for incoming data packets, retrieves them, checks for validity, and forwards them to the appropriate components within the debugger for interpretation or storage.

![The FSM of How Receiving Module Works.](/img/figures/receiver-fsm.jpg)

The above figure depicts the Moore FSM of the receiving module for the sequence of operations required to process incoming data packets. The process begins in the `sIdle` state, where the module awaits a valid signal (`pllInSignal = 1`) to transition to the next states for reading packet data. Upon receiving the signal, the FSM moves to `sReadChecksum` to verify the integrity of the data packet by reading the checksum from the specified offset. Following a successful checksum read, the FSM transitions to `sReadIndicator` to read an indicator value that determines the type of packet being processed.

The FSM proceeds to the `sReadTypeOfThePacket` state, where it identifies the packet type. Depending on the validity of the indicator, the FSM either moves to `sReadRequestedActionOfThePacket` to fetch the specific action requested by the packet or reverts to the `sIdle` state if the indicator is invalid. Valid packets lead to the `sRequestedActionIsValid` state, where the requested action is confirmed, and the address for reading the next data is set. The FSM then cycles through states such as `sReadActionBuffer` and `sWaitToReadActionBuffer`, handling the data reception and buffering process. The cycle continues until all data is read, eventually transitioning to the `sDone` state, indicating the data reception's completion.