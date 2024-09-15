---
sidebar_position: 4
---

# IDELAYE2/3

IDELAYE3, or Input Delay Element, is a programmable delay line used to manage signal timing and synchronization in digital circuits. It allows precise adjustment of the delay applied to incoming signals, facilitating accurate timing alignment and data capture.

IDELAYE3 is commonly used in high-speed communication interfaces, where precise timing control is critical for maintaining signal integrity and synchronization. By adjusting the delay of incoming signals, IDELAYE3 helps ensure that data is correctly aligned with the clock signals.

![IDELAYE3 Primitive. (Source: https://docs.amd.com/r/en-US/ug571-ultrascale-selectio/IDELAYE3)](/img/figures/X16016-idelaye3-primitive.jpg)

Security researchers can exploit IDELAYE3 components to introduce deliberate delays in signals, [manipulating the timing characteristics of the device](https://arxiv.org/abs/2405.03632). By carefully adjusting these delays, any variations induced in power consumption, electromagnetic emissions, or timing of an IP core can be observed and analyzed as side-channel leakage. Such attacks can potentially disclose sensitive information, including cryptographic keys or data patterns, by exploiting the unintentional side effects of signal manipulation facilitated by IDELAYE3. Thus, IDELAYE3 is also added as a debugging component to hwdbg. Figure below shows a chain of IDELAYE components used to adjust the clock signal delay.

![IDELAYE2 Configuration.](/img/figures/idelay.jpg)