# Homework 2, Problem 1

## Setup

Add `hw2p1.js` file in this directory.

```bash
# remove --rm to persist container
docker run -it \
  --rm \
  --name ee547-hw2p1-test \
  -v "$(pwd)":/usr/src/app/ \
  -w /usr/src/app \
  node:20 \
  /bin/bash
```

## Testing

```bash
npm install
npm test
```
