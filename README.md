# lbl-pages

[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> static web app workflow

## Installation

```shell
$ npm install lbl-pages

# or yarn
$ yarn add lbl-pages
```

## Usage

<!-- TODO: Introduction of API use -->

```javascript
const lblPages = require('lbl-pages')
const result = lblPages('zce')
// result => 'zce@zce.me'
```

## API

<!-- TODO: Introduction of API -->

### lblPages(name[, options])

#### name

- Type: `string`
- Details: name string

#### options

##### host

- Type: `string`
- Details: host string
- Default: `'zce.me'`

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; leebailin



[downloads-image]: https://img.shields.io/npm/dm/lbl-pages.svg
[downloads-url]: https://npmjs.org/package/lbl-pages
[version-image]: https://img.shields.io/npm/v/lbl-pages.svg
[version-url]: https://npmjs.org/package/lbl-pages
[license-image]: https://img.shields.io/github/license/leebailin/lbl-pages.svg
[license-url]: https://github.com/leebailin/lbl-pages/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/leebailin/lbl-pages.svg
[dependency-url]: https://david-dm.org/leebailin/lbl-pages
[devdependency-image]: https://img.shields.io/david/dev/leebailin/lbl-pages.svg
[devdependency-url]: https://david-dm.org/leebailin/lbl-pages?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
