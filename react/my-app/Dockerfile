FROM node:20

WORKDIR /my-app

COPY package.json package-lock.json ./
RUN npm install

COPY . .


# Vite dev server port
EXPOSE 5173

# Run Vite using CMD
CMD ["npm", "run", "dev", "--", "--host"]