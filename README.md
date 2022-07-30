# Blockchain Explorer Web

A clean, professional looking, mobile responsive clone of a Bitcoin Explorer, coded in React+TS. It can also scale to blockchains other than Bitcoin later, easily.

## Demo

- https://blockchain-explorer-web.vercel.app/
- Before accessing, please make sure CORS is allowed using this extension - https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en

---

## Part 1: Home Screen & Search

1. Block explorer listing (table) showing critical Block information of latest 15 blocks.
2. Search functionality to redirect the user to any searched block's details and transactions.
3. Block hashes are clickable to go to their respective details screens

<p float="left">
<img height="250px" style="border:1px solid #efefef;" src="https://user-images.githubusercontent.com/7558499/181947028-40da7868-b576-47a5-ab5d-2b08c626eedf.png" />
<img height="250px" style="border:1px solid #efefef;" src="https://user-images.githubusercontent.com/7558499/181948675-4cd48dd3-00f7-4057-9479-8afc2ef4e0ca.png" />
</p>

### Listing API integration

1. API integration - Fetch latest 1hr blocks using this api - https://blockchain.info/blocks
2. API integration - Using the heights received, fetched the block listing details using this api - https://chain.api.btc.com/v3/block
3. Aggregated their results, and used it to popuplate the list page.

---

## Part 2: Block Details and Searching

1. On click of search or pressing enter, or clicking on any Hash Link, routed to details screen - /block/[searched string]
2. On this page mount, checked if the route hash is valid, if yes, showed the details.
3. If the route hash is not valid, or any other backend error, showed the troubleshooting instructions - with a countdown timer for API rate limiting issues.

<p float="left">
<img height="250px" style="border:1px solid #efefef;" src="https://user-images.githubusercontent.com/7558499/181950405-fcc83a41-814e-442a-8567-0b63a961fe50.png" />
<img height="250px" style="border:1px solid #efefef;" src="https://user-images.githubusercontent.com/7558499/181951322-f15bfc0a-e8ba-4b96-9244-4132a79e60c3.png" />
</p>

### Block Details API integration

1. API integration - Fetch block details API 1 - https://blockchain.info/rawblock/$block_hash
2. API integration - Fetch block details API 2 - https://chain.api.btc.com/v3/block/
3. Aggregated their results, did additional calculations for summing up total transaction volumes, etc.

---

## Part 3: Transactions

1. The final data aggregated after the block-details API contains the detailed transactions array, used that to show transactions in the best manner.
2. Implemented simple pagination (as the txn_count exceeds 2-3k) - this made the page performant, smooth and manageable.

<p float="left">
<img height="250px" style="border:1px solid #efefef;" src="https://user-images.githubusercontent.com/7558499/181953867-263ae7d9-0846-4b68-a70a-d9340660e838.png" />
<img height="250px" style="border:1px solid #efefef;" src="https://user-images.githubusercontent.com/7558499/181954771-b7eb2c9f-aab6-4907-82f7-e03e064b9475.png" />
</p>

---

## Geeking out - Dev Stats

https://wakatime.com/@fe75714b-a5a9-4037-9e5b-6ede33276e24/projects/nskaziqbgx?start=2022-07-25&end=2022-07-31

<p float="left">
<img height="300px" style="border:1px solid #efefef;" src="https://user-images.githubusercontent.com/7558499/181979433-8504f2ff-8dcc-49be-98cf-c31d8594f35e.png" />
</p>

### Future To-Do's

- [ ] Extend functionality to other blockchains like Ethereum, Polygon etc.
- [ ] Introduce better state management for API's and middlewares - especially when computation is involved.
- [ ] Websocket or Polling support for Real-time updates
- [ ] Make layout change in Mobile screens for better UX. Currently did the minimum to ensure the design doesn't break in mobile.
- [ ] Cache the result of rate-limited API's

---

Made with ❤️ By Dewansh Parashar. <br />
Special Thanks to https://www.blockchain.com/ and https://explorer.btc.com/ for making their API's free for public use.
