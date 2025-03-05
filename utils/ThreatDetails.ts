export const threatDetails: Record<string, any> = {
  // 동적
  Minimum: {
    title: "Minimum",
    description:
      "The 'Minimum' function in the Hook contract has been flagged for potential operational issues. If not properly configured, it may lead to restrictions in liquidity management, affecting user accessibility and overall pool efficiency.",
    impact:
      "If the Minimum function is not optimized, liquidity providers may experience unexpected limitations in depositing or withdrawing assets. This can reduce the usability of the liquidity pool and may lead to inefficient capital utilization. In extreme cases, liquidity could become inaccessible, causing trust issues among users and harming the DEX's reputation.",
    recommendation:
      "To ensure seamless liquidity management, it is crucial to verify that the Minimum function is correctly implemented. Developers should conduct rigorous testing to prevent unintended asset locks and ensure that users can freely interact with the liquidity pool under all expected conditions. Additionally, continuous monitoring and updates should be applied to mitigate any operational risks.",
  },
  AddLiquidity: {
    title: "Unexpected Behavior in Add Liquidity Due to Hook",
    description:
      "The Hook function for adding liquidity may not be properly handling liquidity additions, leading to potential discrepancies in the pool balance.",
    impact:
      "Improper liquidity handling can cause pool imbalances, leading to inaccurate token pricing and unexpected user experiences.",
    recommendation:
      "Ensure that the Hook function correctly accounts for all liquidity additions, properly updating the pool state and handling edge cases.",
  },
  RemoveLiquidity: {
    title: "Unexpected Behavior in Remove Liquidity Due to Hook",
    description:
      "The Hook function for removing liquidity may not be correctly adjusting the pool’s liquidity balance, which could impact future transactions.",
    impact:
      "Incorrect liquidity removal may result in leftover or unclaimed liquidity, leading to fund misallocation or incorrect pool behavior.",
    recommendation:
      "Verify that the Hook function accurately tracks liquidity removals, properly adjusting token balances and ensuring smooth exits for liquidity providers.",
  },
  Swap: {
    title: "Unexpected Behavior in Swap Due to Hook",
    description:
      "The Hook function might not be correctly processing swap input/output amounts, possibly affecting price calculations.",
    impact:
      "Improper swap execution can lead to incorrect token amounts being received, price oracle inaccuracies, or arbitrage opportunities that negatively impact users.",
    recommendation:
      "Ensure that swap logic follows expected behavior, maintaining accurate pricing mechanisms and preventing potential miscalculations.",
  },
  Donate: {
    title: "Unexpected Behavior in Donate Due to Hook",
    description:
      "The Hook function may not be properly recording or handling donations, potentially leading to accounting mismatches.",
    impact:
      "Improper donation handling can result in incorrect pool accounting, potentially leading to misplaced funds or unexpected token distributions.",
    recommendation:
      "Verify that the Hook function correctly records and applies donations, ensuring they are properly allocated and reflected in the pool’s balance.",
  },
  TimeLock: {
    title: "TimeLock",
    description:
      "In some DEX scam cases, liquidity providers are prevented from reclaiming all their assets in the Liquidity Pool, or liquidity can only be added or removed at certain times or under certain conditions, leading to user inconvenience and potential loss. If Uniswap V4 Liquidity Pools become unusable after a certain time period, this can result in significant accessibility issues for users.",
    impact:
      "If liquidity becomes inaccessible after a certain time or point, users will face limitations in retrieving or managing their assets in the pool. This could lead to liquidity being 'locked' or unavailable, compromising users' ability to interact with the pool as needed. Such restrictions undermine the availability and reliability of the DEX, harming user trust and potentially resulting in financial loss for those affected.",
    recommendation:
      "To prevent scenarios where a Liquidity Pool becomes unusable after a set period, developers using hooks must carefully design and test to ensure continuous availability. Hook developers should monitor when and under what conditions the Liquidity Pool becomes inaccessible and address any potential access issues to ensure uninterrupted operation. Tracking and modifying problematic hook functions will help maintain liquidity availability and prevent accessibility issues.",
  },
  "Gas Grief": {
    title: "Gas Grief",
    description:
      "The 'Gas Grief' issue arises when transactions on the network require excessive gas fees due to poorly optimized or repetitive function calls. This can happen when functions, like transferring assets or verifying information, are not optimized for gas efficiency or are prone to executing multiple times unnecessarily. In smart contract environments, this inefficiency can create situations where the gas cost far exceeds the value of the transaction itself, making the transaction economically unfeasible for users.",
    impact:
      "When gas grief issues occur, they increase the transaction costs for end users, which can lead to users avoiding interactions with certain smart contracts or dApps. For an attacker, it could mean a potential vector to 'grief' or disrupt others by forcing them to spend disproportionately high gas fees on specific transactions. Over time, this can reduce trust in the platform or lead to increased abandonment of affected services.",
    recommendation:
      "Consider reviewing and optimizing the functions where gas grief may be occurring, particularly by reducing loops or heavy operations within commonly called functions. Additionally, consider implementing batching mechanisms or using layer-2 scaling solutions that can mitigate high gas fees by executing transactions off-chain, reducing the overall gas burden for users.",
  },
  OnlyPoolManager: {
    title: "OnlyPoolManager",
    description:
      "In the context of access control, OnlyPoolManager acts as a critical safeguard, ensuring that only authorized entities (specifically, those with the Pool Manager role) can perform specific actions within a contract. When callback functions are involved, this restriction becomes even more essential. Callback functions allow one contract to call another function as part of a transaction flow, often executing actions based on external conditions or events. If these callbacks are not adequately restricted, they can be exploited by unauthorized parties, leading to unexpected or malicious behavior. The OnlyPoolManager modifier can prevent unauthorized callbacks by enforcing strict access checks.",
    impact:
      "Allowing unrestricted access to callback functions poses several security risks:\n\n" +
      "- Unauthorized Invocation: If callback functions can be triggered by any address or contract, malicious actors could exploit these functions to manipulate the contract’s behavior. They could call functions in unintended ways, potentially draining funds, altering important parameters, or causing state inconsistencies.\n" +
      "- Unexpected Reentrancy: Unrestricted callbacks can open up reentrancy risks, where an attacker repeatedly calls a callback to execute the same function multiple times before it finishes. This can lead to unexpected changes in contract state or even asset theft if the contract is handling funds.\n" +
      "- Loss of Control: Callback functions are typically designed to be invoked only by specific contracts or addresses under particular conditions. If OnlyPoolManager is not applied, there’s a risk that unauthorized contracts might control these functions, reducing the protocol’s security and undermining its intended design\n",
    recommendation:
      "Implement the OnlyPoolManager modifier on any Hook callback functions to ensure they are only callable by authorized entities or under predefined conditions. Additionally, consider adding other safeguards like non-reentrant checks to prevent reentrancy attacks. Conduct regular audits of callback functions, focusing on who can call them and under what circumstances, to ensure there are no vulnerabilities. Using a well-defined ACL system around callbacks can prevent unauthorized access, protect contract integrity, and maintain user trust in the system.",
  },
  ReInitialize: {
    title: "ReInitialize",
    description:
      "The reinitialize keyword is used in smart contract design to allow re-execution of initialization functions under controlled conditions. It is particularly relevant for another `poolKey`, where developers may need to add new initialization logic. the initialize function is typically called only once to set up the contract state.",
    impact:
      "- The ability to reinitialize can be beneficial, but it also introduces potential risks if not handled carefully.\n" +
      "- Unintentional Resetting: Revitalizing can inadvertently reset critical parameters if access controls are not strict, potentially leading to loss of data, funds, or other unwanted changes in contract state.\n" +
      "- Security Risks: If re-initialization functions are poorly secured, an attacker could potentially reinitialize the contract to exploit new or existing vulnerabilities, allowing them to take control or modify the contract’s functionality in unintended ways.\n" +
      "- Compatibility Issues: Improper or excessive use of reinitialize can lead to storage clashes or inconsistencies, especially when upgrading complex contracts, leading to possible malfunctions or unexpected behavior.\n",
    recommendation:
      "Carefully plan each initialize to avoid overlapping storage variables or conflicting logic, and only allow reinitialize functions for setting up newly added state variables rather than altering any previous initialization values. Conduct thorough testing and audits for each re-initialization to avoid any security risks and preserve data integrity.",
  },
  Upgradeability: {
    title: "Upgradeability",
    description:
      "The hook contract for that pool key has been identified as a proxy contract.",
    impact:
      "The upgradeability feature can lead to serious security threats. If the upgrade mechanism is poorly implemented or insufficiently protected, malicious actors could exploit it to introduce unauthorized code, alter contract behavior, or even take control of assets within the contract. Common issues include:\n\n" +
      "- Unauthorized Upgrades: Weak access controls could allow unauthorized parties to perform upgrades, leading to full control over contract functionality and access to sensitive assets.\n" +
      "- Storage Collisions: Upgrades may unintentionally overwrite important storage variables, leading to corruption of contract data or breaking functionality.\n" +
      "- Backdoor Vulnerabilities: Upgradable contracts may unintentionally include hidden functions or weak upgrade permissions, enabling potential attackers to perform arbitrary upgrades at a later date.\n" +
      "- User Trust: Frequent or unauthorized upgrades can erode user confidence, as users may fear losing funds or being subject to unexpected behavior changes.\n",
    recommendation:
      "Special attention needs to be paid to whether the proxy contract can be changed without permission.",
  },

  //정적
  "Missing token transfer while burnt": {
    title: "Missing Token Burn in Redeem Function",
    description:
      "The `_burn` function is not called before or after a token transfer in the `redeem` function. This could result in tokens not being properly removed from circulation, leading to inconsistencies in token accounting.",
    impact:
      "If tokens are not correctly burned during redemption, it can lead to inflationary issues or unintended token accumulation. This could allow users to retain redeemable tokens even after they should have been burned, potentially introducing security vulnerabilities and economic inconsistencies.",
    recommendation:
      "Ensure that the `_burn` function is properly invoked in the `redeem` function, either before or after the transfer operation, to maintain correct token supply and prevent unintended token retention.",
  },
  "Using Slot0 directly to return price data as an oracle": {
    title: "Price Oracle Manipulation Risk",
    description:
      "Using Slot0 directly to return price data as an oracle can introduce vulnerabilities due to its susceptibility to manipulation. Slot0 reflects the most recent liquidity and price state, but it can be influenced by flash loans or other temporary liquidity shifts, leading to inaccurate price feeds.",
    impact:
      "If an attacker exploits this weakness, they could manipulate the price oracle by momentarily shifting the liquidity pool’s state. This could result in incorrect price data being used in smart contracts relying on the oracle, potentially causing loss of funds, miscalculations in DeFi protocols, or market instability.",
    recommendation:
      "To mitigate this risk, consider implementing time-weighted average price (TWAP) calculations instead of relying solely on Slot0. Additionally, integrating multiple data sources or safeguards against flash loan attacks can help improve price oracle reliability and security.",
  },
  "Low call": {
    title: "Usage of Low-Level Call",
    description:
      "The contract makes use of low-level `call` instead of `transfer` or `send`. While `call` is more flexible and can be used to interact with non-standard contracts, it bypasses important security checks and requires manual handling of return values.",
    impact:
      "Using `call` without proper validation may lead to security vulnerabilities, such as reentrancy attacks or unintended failures if the call is unsuccessful. Additionally, since `call` does not forward a fixed amount of gas like `transfer`, it can make the contract susceptible to gas griefing attacks.",
    recommendation:
      "Consider using `transfer` or `send` where possible to ensure safer Ether transfers. If `call` is necessary, implement proper checks for return values and handle failures appropriately to mitigate potential security risks.",
  },
  "Missing onlyPoolManager modifier": {
    title: "Missing onlyPoolManager Modifier",
    description:
      "The hook functions should be restricted to be called only by the PoolManager. Without this restriction, unauthorized entities might invoke critical functions, leading to unintended behaviors or security vulnerabilities.",
    impact:
      "If the hook functions can be called by any contract or external account, it may result in unauthorized access, manipulation of pool parameters, or even financial loss. Attackers could exploit this to execute arbitrary operations, disrupting the protocol's integrity.",
    recommendation:
      "Ensure that all relevant hook functions include an `onlyPoolManager` modifier to restrict access exclusively to the PoolManager contract. Additionally, conduct a security audit to verify that no functions are unintentionally exposed to unauthorized callers.",
  },
  "Misconfigured Hook": {
    title: "Misconfigured Hook",
    description:
      "Some hook functions are not implemented, yet their corresponding flags in 'getHookPermissions()' are set to true. This misconfiguration can lead to unexpected behavior when the PoolManager attempts to call these functions.",
    impact:
      "If a hook function is expected to be executed but is missing, it may cause transaction failures or undefined behavior. This could disrupt the pool’s operation, prevent proper execution of trades or liquidity management, and introduce security risks.",
    recommendation:
      "Ensure that all hook functions marked as active in 'getHookPermissions()' are properly implemented. If certain hooks are not required, set their respective flags to false to prevent unintended contract interactions.",
  },
  "Using tx.origin": {
    title: "Using tx.origin for Access Control",
    description:
      "Using tx.origin to enforce access control can make the contract vulnerable to phishing attacks. Attackers can trick users into initiating transactions from a trusted contract, which can then execute malicious operations on their behalf.",
    impact:
      "Contracts relying on tx.origin for authentication can be compromised by phishing attacks. If a user interacts with a malicious contract, it can initiate transactions on their behalf, bypassing security checks and leading to asset loss or unauthorized access.",
    recommendation:
      "Avoid using tx.origin for access control. Instead, use msg.sender, which ensures that only the immediate caller (rather than the original transaction initiator) has access. Implement role-based access control (RBAC) or OpenZeppelin's Ownable pattern for secure authentication.",
  },
  "non-payable-constructor": {
    title: "Non-Payable Constructor Gas Inefficiency",
    description:
      "The constructor of this contract is marked as non-payable. Making the constructor payable can save gas costs because it removes an additional check for zero ETH transfers, reducing transaction overhead.",
    impact:
      "If the constructor is non-payable, the contract incurs additional gas costs due to the implicit check for zero ETH transfers. This inefficiency can be significant in high-deployment scenarios, leading to unnecessary expenses.",
    recommendation:
      "Consider marking the constructor as payable if the contract does not require an explicit check for zero ETH transfers. This optimization can reduce gas costs during deployment, improving overall efficiency.",
  },
  "state-variable-read-in-a-loop": {
    title: "State Variable Read in a Loop",
    description:
      "Reading or writing state variables inside loops is inefficient because each access requires an additional storage read or write operation, which incurs high gas costs. This can significantly impact contract performance and increase transaction fees.",
    impact:
      "Frequent state variable reads and writes inside loops increase gas costs due to multiple interactions with Ethereum's storage, making transactions more expensive and inefficient. This can especially be problematic in functions that iterate over large datasets.",
    recommendation:
      "Store state variable values in a local variable before entering the loop, then use the local variable inside the loop to reduce repeated storage accesses. This optimization minimizes gas costs and improves execution efficiency.",
  },
  "use-nested-if": {
    title: "Use Nested If Statements for Efficiency",
    description:
      "Using nested if statements is often more gas-efficient compared to combining multiple conditions with logical AND (&&). This approach can lead to lower execution costs and improved contract performance.",
    impact:
      "Logical AND (&&) requires evaluating all conditions, even when an earlier condition fails, leading to unnecessary computation and increased gas consumption. Nested if statements allow for short-circuit evaluation, reducing the number of operations executed.",
    recommendation:
      "Instead of chaining multiple conditions using &&, structure conditions using nested if statements where applicable. This optimizes execution flow, improves readability, and enhances test coverage.",
  },
  "use-prefix-decrement-not-postfix": {
    title: "Use Prefix Decrement Instead of Postfix",
    description:
      "Using the prefix decrement (--i) instead of the postfix decrement (i--) is more gas-efficient when the return value is not needed. The prefix decrement modifies the value before returning it, avoiding unnecessary temporary storage.",
    impact:
      "Postfix decrement (i--) creates an additional temporary variable to hold the previous value before decrementing, which leads to increased gas usage. Using prefix decrement (--i) eliminates this overhead, reducing transaction costs.",
    recommendation:
      "If the return value of the decrement operation is not required, use the prefix form (--i) instead of the postfix form (i--) to optimize gas efficiency.",
  },
  // 다른 위협 상세 정보 추가 가능
};
