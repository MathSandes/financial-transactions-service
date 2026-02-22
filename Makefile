setup:
	npm install
	npx prisma generate
	npm run docker:up
	npx prisma migrate dev --name init

dev:
	npm run dev

test:
	npm test

down:
	npm run docker:down
