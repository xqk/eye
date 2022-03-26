/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <eye.icl.site@gmail.com>
 * Released under the AGPL-3.0 License.
 */
const {override, addDecoratorsLegacy, addLessLoader} = require('customize-cra');

module.exports = override(
  addDecoratorsLegacy(),
  addLessLoader(),
);
