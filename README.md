# ngx-spec

A missing schematic for creating Angular spec.

Works only from @angular/cli@^6.0.0 on.

## Installation

Angular 7+:

```sh
npm i -D ngx-spec@^2.0.0
```

Angular 6 (only `spec`, no `specs` support):

```sh
npm i -D ngx-spec@^1.0.0
```

## Supported types

Supported types are

```ts
const SupportedTypes = ['component', 'directive', 'guard', 'service', 'pipe'];
```

## ng g ngx:spec

Run:

```sh
ng g ngx-spec:spec path/my.service
```

or

```sh
ng g ngx-spec:spec path/my.service.ts
```

> Please note that in a standard Angular CLI project the path will start at `src/app`. That's why if you use the file paths then it would be comfortable to `cd src/app` first and then safely use the shell autocompletion to produce the proper path.

## ng g ngx-spec:specs

Batch specs generator. Supports [minimatch](https://github.com/isaacs/minimatch) globs. Does not override existing spec files.

**Important:** the glob should be passed as a string, otherwise OS tries to intercept it with *its* glob.

Examples:

```sh
ng g ngx-spec:specs 'path/*.service.ts'
```

```sh
ng g ngx-spec:specs '**/*.service.ts'
```

```sh
ng g ngx-spec:specs '**/*'
```

etc. 

> Please note that in a standard Angular CLI project the path will start at `src/app`. That's why if you use the file paths then it would be comfortable to `cd src/app` first and then safely use the shell autocompletion to produce the proper path.

## Usage in Visual Studio Code

It could be easier to use the schematic with [vscode-angular-schematics extension](https://github.com/cyrilletuzi/vscode-angular-schematics) in Visual Studio Code.

## History

See the story behind [on stackoverflow](https://stackoverflow.com/q/46276055/1990451) and [on Angular CLI github issue](https://github.com/angular/angular-cli/issues/7727).

## License

MIT
