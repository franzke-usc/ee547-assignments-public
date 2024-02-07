# Homework 2, Problem 2

### Setup

Add `hw2p2.py` file in this directory.

```bash
# remove --rm to persist container
docker run -it \
  --rm \
  --name ee547-hw2p2-test \
  -v "$(pwd)":/usr/src/app/ \
  -w /usr/src/app \
  node:20 \
  /bin/bash
```

Install dependencies

```bash
apt-get update
apt-get install -y \
  jq \
  libcap-dev
```


### Testing

```bash
./driver.sh
```