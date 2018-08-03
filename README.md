# ngx-spec

A missing schematic for creating Angular spec.

Works only from @angular/cli@^6.0.0 on.

## Installation

```sh
npm i -D ngx-spec
```

## Usage

Supported types are

```ts
const supportedTypes = ['component', 'directive', 'guard', 'service', 'pipe', 'module'];
```

Run:

```sh
ng g ngx-spec:spec path/my.service
```

or

```sh
ng g ngx-spec:spec path/my.service.ts
```

> Please note that in a standard Angular CLI project the path will start at `src/app`. That's why if you use the file paths then it would be comfortable to `cd src/app` first and then safely use the shell autocompletion to produce the proper path.

## History

See the story behind [on stackoverflow](https://stackoverflow.com/q/46276055/1990451) and [on Angular CLI github issue](https://github.com/angular/angular-cli/issues/7727).

## License

MIT
