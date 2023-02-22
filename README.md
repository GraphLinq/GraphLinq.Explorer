# Graphlinq Explorer

An open-source, fast, local, laptop-friendly Ethereum block explorer.

### Installation

```
git clone https://github.com/ethereum-lists/4bytes.git
git clone https://github.com/ethereum-lists/chains.git
git clone https://github.com/wmitsuda/topic0.git
git clone https://github.com/trustwallet/assets.git

npm run start -- --port 5174
```

### Developement

Shell number 1 for front-end debug
```
npm run start
```

Shell number 2 for backend debug
```
npm run server
```

Backend src api/routes directory.
Frontend src src directory.

### Production

```
docker buildx build -t glqscan .
docker run -p 8081:8080 glqscan
```
go to http://x.x.x.x:8081/

### Base Project

[https://github.com/wmitsuda/otterscan](https://github.com/wmitsuda/otterscan)
