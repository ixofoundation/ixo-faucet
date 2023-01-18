# Ixo Faucet

## Prerequisite

```sh
node -v
v16.15.0
```

# Installation

- clone code:

```sh
git clone https://github.com/ixofoundation/ixo-faucet.git
```

- setup configs, you have to change everything you need in `./config.js`

```js
{
   "port": 80,  // http port
   "db": {
       "path": "~/.faucet.db" // db for frequency checker(WIP)
   },
   "blockchain": {
       "rpc_endpoint": "https://testnet.ixo.earth/rpc/"
   },
   "sender": {
       "option": {
           "hdPaths": ["m/44'/118'/0'/0/0"],
           "prefix": "ixo"  //address prefix
       }
   },
   "tx": {
       "amount": {
           "denom": "uixo",
           "amount": "1000000" // how many does tx send for each request.
         },
       "fee": {
           "amount": [
               {
                 "amount": "1000",
                 "denom":  "uixo"
               }
           ],
           "gas": "200000"
       },
   },
   "project": {
       "name": "Ixo Testnet",
       "logo": "https://p2psend.jambo.earth/_next/image?url=%2Fimages%2Flogo.png&w=3840&q=75",
   },
   // request limitation
   limit: {
       // how many times each wallet address is allowed in a window(24h)
       address: 1,
       // how many times each ip is allowed in a window(24h),
       // if you use proxy, double check if the req.ip returns client's ip.
       ip: 10
   }
}
```

- Run faucet

```sh
node --es-module-specifier-resolution=node faucet.js
```

# Test

visit http://localhost:80

80 is default, you can edit it in the config.json
