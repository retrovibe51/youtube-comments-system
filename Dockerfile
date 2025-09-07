FROM node:20.16-alpine AS deps
WORKDIR /app

# Copy only the files needed to install dependencies
COPY package.json yarn.lock* tsconfig.json ./

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# Install dependencies with the preferred package manager
RUN yarn --frozen-lockfile

FROM node:20.16-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the files
COPY . .

# Run build with the preferred package manager
RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Re-run install only for production dependencies
RUN yarn --frozen-lockfile --production && yarn cache clean

FROM node:20.16-alpine AS run
WORKDIR /app

# Copy the bundled code from the builder stage
COPY package.json .
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Use the node user from the image
USER node

# Start the server
CMD ["node", "dist/src/main.js"]