---
sidebar_position: 1
---

# Sending Module

This module is responsible for transmitting data from the hardware debugger (hwdbg) or the Programmable Logic (PL) to the Processor System (PS). It handles the process of packaging the data into packets suitable for transmission and sending them out through the designated port. Additionally, it adds different headers and manages any necessary handshaking protocols, and adjusts mandatory fields to ensure successful data transmission.

![The FSM of How Sending Module Works.](/img/figures/sending-data-fsm.jpg)

This module ensures the orderly and correct transmission of data from the module to the designated receiver. The state machine of the module begins in the `sIdle` state, where it initializes key variables and awaits the signal to begin sending data (`beginSendingBuffer = 1`). Once this signal is received, the sender module transitions to the `sWriteChecksum` state, where it writes the checksum offset and initializes the data transfer process.

Next, to prepare headers it moves to various states such as `sWriteIndicator`, `sWriteTypeOfThePacket`, and `sWriteRequestedActionOfThePacket`. In these states, the module writes specific pieces of data to designated addresses, preparing the data packet for transmission. When there is no new header data to send, the FSM transitions to the `sWaitToGetData` state, where it awaits the arrival of valid data (`dataValidInput = 1`). Once valid data is received, the FSM moves to the `sSendData` state, where the actual data transmission occurs. If no more data is available (`noNewDataSender = 1`), the FSM transitions to the `sDone` state, signaling the completion of the sending process (`finishedSendingBuffer = 1`) and setting the interrupt for the processor system (`psOutInterrupt = 1`). This module ensures data is sent accurately, avoiding conflicts and maintaining the integrity of the data in the BlockRAM.