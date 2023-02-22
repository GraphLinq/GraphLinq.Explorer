# Stage 1
FROM alpine/git as clone
WORKDIR /clone
RUN git clone https://graphlinq-code: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@github.com/GraphLinq/GraphLinq.Explorer.git
WORKDIR /clone/GraphLinq.Explorer
# RUN git clone https://github.com/ethereum-lists/4bytes.git
# RUN git clone https://github.com/ethereum-lists/chains.git
# RUN git clone https://github.com/wmitsuda/topic0.git
# RUN git clone https://github.com/trustwallet/assets.git
# Stage 3
FROM node:14 AS final
WORKDIR /app
COPY --from=clone /clone/GraphLinq.Explorer/ .
RUN npm install
RUN npm run speed-build
ENTRYPOINT ["node", "http_server.js"]
