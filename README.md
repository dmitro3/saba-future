# saba-future
This will be the awesome prediction market that will be the future for us

# Vision
    - Any resolvable prediction (event) can allow market exchanges

# Tech Overview
    - Utilize Polygon Chain (L2 sidechain of Ethereum) for web3 deployment
    - hardhat folder & nextjs folder

# Prerequisite
    - npm (16.16.0)
        - highly recommend nvm
    - Alchemy Account
    - Hardhat
        - `npm install --save-dev hardhat`
    - Metamask

## Terminology
    - 3 Roles
            - Owner (PredictionWorld contract creator)
            - Admin (Will be owner by default) - create/resolve markets
            - Player - make bets * owner and admin can do so too
    - Create Prediction (Owner/Admin)
        - check /hardhat/contracts/PredictionWorld3.sol
    - Place Bet
        - check /hardhat/contracts/PredictionWorld3.sol
    - Event Resolve(settle market)
        - check /hardhat/contracts/PredictionWorld3.sol

## MVP Stories
    - Functioning
        - US1: Admin can create market
        - US2: New Player start with zero tokens
        - US3: Admin can transfer tokens to New(Any) Player
        - US4: Player with SURE can place bet on market
            - note, need to transfer token to PredictionWorld
        - US5: Admin can settle markets(distributeWinning)

    - Not yet functioning
        - US8: Show correct SURE token - web and wallet show the same numbers
        - US6: First time players can just use a social login to enter
        - US7: First time players will see 100 SURE tokens in balance
        - US9: Players don't have to have matic to place bet

### Backlog
    - Seamless Signup
    - Show actual winnings for players
    - Show outcome as Yes/No
    - Map wallet account with a name
    - Filter & searches
    - Rake for resolvement
    - Oracle
        - Automatic prediction resolvement
    - Real Matic
    - Player specific resolve list
    - Tags for prediction categories
    - Refactor

#### Backbacklog XD
        - Partial taking of market
        - Cancel market(only the part not yet taken)
        - Prediction Creation by Player
        - Total Pool Betting
    
    