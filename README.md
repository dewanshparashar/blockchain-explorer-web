## Blockchain Explorer Web

## Part 1: Home Screen & Search

1. Duplicate the screen design.
2. Design - Block explorer logo
3. Design - Search bar and button
4. Design - Latest block listing (hardcoded)
5. Design - Make the block hashes clickable
6. And should take you to /some-route
7. Design - Make the BLOCK DETAILS screen - simple listing
8. Design - In the end, make it all responsive!

# Listing API integration

1. API integration - Fetch latest 1hr blocks using this api - https://blockchain.info/blocks/1658590183179?format=json
2. API integration - Using the heights received, fetch block listing details using this api -
   https://api.blockchain.info/haskoin-store/btc/block/heights?heights=746127,746128,746129&notx=true .
3. You can show the perfect data in listing now.

# Searching API integration

1. On click of search or pressing enter, route to /btc/block/[searched string]
2. On page mount call an API : https://blockchain.info/rawblock/$block_hash
3. Once you get the data - show it simply in a listed format on the screen.
4. In case the user entered wrong block or you get an invalid response, then show a "Oops! Section"

---

## Part 2: Transactions

1. The data received in the block-details API will contain the detailed transactions array
2. Use that to replecate the design
3. Implement pagination - can I use a library? Nope. Implement native pagination, easy.
