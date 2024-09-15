---
sidebar_position: 2
---

# Script Execution Stages

To enable on-the-fly script evaluation, script execution is divided into several stages. Each stage includes multiple flip-flops, with the number of flip-flops equal to the number of input pins. Additionally, each stage contains a small buffer (which could be either SRAM or flip-flop) that holds the specific operation to be performed in that stage.

After the debugger transmits the script buffer to the debuggee (PL), hwdbg configures these small buffers with the details of the actions (operators and values) required for each stage. The evaluation module then advances the registers to the next stage with each clock cycle. At each stage, the input flip-flops are evaluated according to the script, and the values of the pins may be modified based on the script's instructions. Once the execution completes all stages, the final stage passes the flip-flops to the *Output Policy Stage* before sending them to the output pins. The following figure depicts a 4-stage script evaluation engine. Note that the number of stages is configurable by the hardware engineer. For example, a debugger equipped with more script execution engines can run more operations within a single script, although this results in a larger hardware area (utilized resources in FPGAs).

![4-Stage Script Evaluation and Execution Engine.](/img/figures/exec-stages.jpg)

As mentioned earlier, each execution engine comes with a small buffer (SRAM or Flip-Flop) that contains local operations to that specific stage. This buffer conducts the script evaluation engine on how to behave with the signal at the corresponding stage. The following C structure shows how these local buffers are formed in hwdbg.

```
typedef struct SYMBOL {
    long long unsigned Type;
    long long unsigned Len;
    long long unsigned VariableType;
    long long unsigned Value;
 } SYMBOL, * PSYMBOL;
```

# Output Policy Stage

The last stage before sending flop-flops (possibly modified input) is the *Output Policy Stage*. As its name implies this stage decides how outputs should be sent over the wires (pins). For example, some functions are designed to block output (send zero) which in reality these functions change the policy of this stage and influence the output signal. Other than that, functionalities like stepping through the signals and pausing the signals are implemented by employing this mechanism. The following figure depicts how this mechanism is connected to the script execution stages.

![Script Evaluation Stages and Output Policy.](/img/figures/exec-stages-and-output-policy.jpg)
