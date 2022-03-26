/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <xqkchina@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import { hasPermission } from 'libs';


export default function AuthDiv(props) {
  let disabled = props.disabled === undefined ? false : props.disabled;
  if (props.auth && !hasPermission(props.auth)) {
    disabled = true;
  }
  return disabled ? null : <div {...props}>{props.children}</div>
}
