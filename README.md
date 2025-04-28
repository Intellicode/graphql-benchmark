# graphql-benchmark

## Start servers

```
cd node/<server>
node index.mjs
```

## Start benchmark

```
PORT=4000 node index.js -q simple -d 40 -c 1000 
```

`-d`: duration in seconds
`-c`: connections
`-q`: query type

- simple
- medium
- complex
- super-complex