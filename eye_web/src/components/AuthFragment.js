/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <xqkchina@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import { hasPermission } from 'libs';


export default function AuthFragment(props) {
  return hasPermission(props.auth) ? <React.Fragment>{props.children}</React.Fragment> : null
}
