---
sidebar_position: 11
---

# Loops

At the moment, hardware debugging does not support loops. The absence of loop support stems from the fact that executing loops may require additional clock cycles (stages) to iterate through the scripts. However, this is not feasible because hwdbg directly transfers incoming signals (after the stage delay) to the output without allowing for looping. In certain cases, one can achieve loop behavior by explicitly utilizing consecutive statements.