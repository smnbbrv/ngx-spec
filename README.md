# ngx-spec

A missing schematic for creating Angular spec.

## Installation

```sh
ng add ngx-spec
```

## Usage

Supported types are

```ts
const supportedTypes = ['component', 'directive', 'guard', 'service', 'pipe', 'module'];
```

Run:

```sh
ng g spec ngx-spec:spec path/my.service
```

or

```sh
ng g spec ngx-spec:spec path/my.service.ts
```

## History

See the story behind [on stackoverflow](https://stackoverflow.com/q/46276055/1990451) and [on Angular CLI github issue](https://github.com/angular/angular-cli/issues/7727).

## License

MIT