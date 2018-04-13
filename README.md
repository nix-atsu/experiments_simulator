# Experiments

This is a scratchpad version of a tool for running simultaneous double auctions, with few participants.

Upon joining participants are divided into two groups - buyers and sellers, each of them sees bets of the other group and can bet himself. There's also admin account from which the experiment is started and ended. After the end of the experiment the payoffs for each participant are calculated according to the given rules.

## How
Python, Flask, Sockets, PostgreSql

## Where
It is live from time to time on [heroku](https://market-experiment.herokuapp.com/) , but it has been coded for a one time event, so it has played its role. It might be picked up and finished in the future, but so far it is not quite usable by outsiders. 
