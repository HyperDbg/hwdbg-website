---
sidebar_position: 4
---

# Communication Protocols

The communication protocol follows a packet-based design between sender and receiver. These packets contain special mandatory headers to check for the integrity of the packet and prevent communication errors as well as specifying which component in the debugger/debuggee is responsible for handling the receiving packet and the corresponding action. To achieve this, a communication protocol is designed, similar to the one used in __HyperDbg__, enabling data exchange through shared memory.

For the communication between PL and PS, the following structure is used.

![The Format of Action Request Packets from PS \<\> PL Communication.](/img/figures/packet-memory.png)

This design uses four mandatory fields. The first is the `checksum` of the incoming/outgoing packet primarily used for checking whether the packet is modified communication problems. The second field is the `indicator` of the packet which is used to identify that the packet is related to a HyperDbg-compatible interpreter. The following table shows an example of a valid indicator.

| **Constant Name**                 | **Value**             |
|-----------------------------------|-----------------------|
| INDICATOR\_OF\_HYPERDBG\_PACKET   | 0x4859504552444247    |

The third field is `TypeOfThePacket`. Two exclusive packet types are owned by hwdbg for sending data from debugger (PS) to debugged (PL) and from debuggee (PL) to debugger (PS).

| **Packet Type**                                       | **Description**                               |
|------------------------------------------------------|-----------------------------------------------|
| DEBUGGER\_TO\_DEBUGGEE\_EXECUTE\_ON\_VMX\_ROOT        | Debugger to debuggee (VMX-root)               |
| DEBUGGER\_TO\_DEBUGGEE\_EXECUTE\_ON\_USER\_MODE       | Debugger to debuggee (user-mode)              |
| DEBUGGEE\_TO\_DEBUGGER                               | Debuggee to debugger (user/kernel & VMX-root) |
| DEBUGGER\_TO\_DEBUGGEE\_HARDWARE\_LEVEL              | Debugger to debuggee (hardware), used in hwdbg|
| DEBUGGEE\_TO\_DEBUGGER\_HARDWARE\_LEVEL              | Debuggee to debugger (hardware), used in hwdbg|

The communication structure is synchronized between hwdbg (written in Scala) and __HyperDbg__ (written in C) and it is demonstrated as follows:

```
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
```

# Main Communication Modules

There are 4 Main Communication Modules in hwdbg:

- Sending Module
- Receiving Module
- The Sender/Receiver Synchronization Module
- item Interpreting Module

Since there is only one port shared with PS and PL has only one port to the BlockRAM, hwdbg cannot simultaneously read/write to the BlockRAM. Thus, the above modules are designed to handle these situations to avoid simultaneous sending and receiving, which can cause data corruption and invalid data in the BlockRAM. Once valid data is received, the interpreter module attempts to interpret the packet and may also send data as a result of interpretation.

# Raw Shared Channel Project for Testing Artifacts

For testing artifacts, a shared PS \<\> PL project has been written to create a channel between the PS and the PL by sharing an 8 KB (can be customized) Block RAM (BRAM) as well as an interrupt line from PL to PS, and a GPIO line from PS to PL. The BRAM is made accessible for both PS and PL communication. The following figure depicts the high-level design of the PS \<\> PL shared channel in Vivado. \\


![High-level Overview of PS \<\> PL Communication Over AXI Bus.](/img/figures/ps-pl-shared-channel.jpg)