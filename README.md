# Starter frontend template for NEAR projects

## Features:

- Routing
- Dark Theme toggler
- Tailwind CSS
- Redirect Page

<hr/>

## Things to change:

### `NEAR/config.js` :

1. Change contract name - line 1

### `src/index.js` :

1. Choose environment (testnet / mainnet) - line 14
2. Add contract's functions (view & change) - lines 42,44

### `src/App.js` :

1. Change contract name at sign in method - line 14

### `public/index.html` :

1. Change `<title>` tag - line 27
2. Change description - line 10
3. Change favicon.ico, logo192.png, and logo512.png

<hr/>

## Functions calling:

- Pass the `contract` to any component, and then call `contract.myFunction()`

- If it has any parameters, then `contract.myFunction({ arg1 : 'a', arg2 : 'b' })`

- To get the hash of any transaction:

```js
// pass wallet to the component from App.js
const resp = await wallet
  .account()
  .signAndSendTransaction({
    receiverId: 'abcdefg.testnet',
    actions: [
      // import { transactions } from 'near-api-js';
      transactions.functionCall(
        'methodName',
        {
          arg1: id,
          arg2: newOwner,
        },
        30000000000000, // 300 Tgas
        0 // attached money
      ),
    ],
  })
  .catch((err) => {
    console.log(err);
  });
console.log(resp.transaction.hash); // gets the hash
```
