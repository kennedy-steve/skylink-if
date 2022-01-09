FROM node:16

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install packages
RUN npm install

# Copy the app code
COPY . .

# Generate Prisma
RUN npm run prisma:generate

# Build the project
RUN npm run build

# Expose ports
EXPOSE 8080

# Run the application
CMD [ "node", "dist/app.js" ]
