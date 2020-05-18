# ts-cli

## Live build (development mode)
```
npm start
```

## Run cli command (typescript)
```
npm run cli
npm run cli -- -f data/items2.txt -r 50 --lat 52.493256 --long 13.446082
npm run cli -- -f data/items2.txt -r 50
```

## Run cli command (javascript)
```
npm run build && npm run cli-js
```

## Testing
```
npm run test-suite
```

## Run only tests with a name that matches the regex
```
npm t -- -t "some pattern"
```