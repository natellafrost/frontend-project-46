install:
	npm ci

test:
	npm test

lint:
	npx eslint .

test-coverage:
	npx vitest run --coverage
