.SILENT:

.PHONY: build
build: tsc

.PHONY: test
test: standard tsc/dry-run jest

.PHONY: tsc
tsc:
	tsc

.PHONY: tsc/dry-run
tsc/dry-run:
	tsc -p tsconfig.test.json

.PHONY: standard
standard:
	standardts src/**/*.ts

.PHONY: jest
jest:
	jest --no-cache
