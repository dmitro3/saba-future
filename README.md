# saba-future
This will be the awesome prediction market that will be the future for us

# Vision
    - Any resolvable event (prediction) can be a market

# Tech Overview
    - Utilize Polygon Chain (L2 sidechain of Ethereum) for web3 deployment

# Prerequisite
    - npm (16.16.0)
        - highly recommend nvm
    - Alchemy Account
    - Hardhat
        - `npm install --save-dev hardhat`
    - Metamask

# Resources
    - Faucets (free test network tokens)
        - https://mumbaifaucet.com/
        - https://goerlifaucet.com/
        - https://sepoliafaucet.com/

## MVP Stories
    - Two roles within platform: Admin & Players
        - Admin will be in charge of creating and resolving markets
        - Player will be able to place bet on the yes/no resovlement of markets
    - Sign Up/ Sign In
        - Admin will get credentials manually from platform owner
        - Players can sign up "magically" with just an email
        - After signing up, the player will get 100 SURE(SabaFuture) tokens
    - Create Event (Admin)
        - Info
            - Description of a Yes/No event, e.g. Will Lakers win tomorrow
            - Details(optional)
            - Last Accept time
            - Resolve Time
    - Open Market (Player)
        - According to event, player can open, e.g. 50 SURE for 80 SURE on "yes"
    - Take Market (Player)
        - For opened market, player can take it up => basically exchange
    - Event Resolve
        - Transfer SURE tokens to players accordingly

## Contracts
    - Event
        - Description
        - Last Accept time
        - Resolve Time
        - Markets[(amount, maker, odds)]