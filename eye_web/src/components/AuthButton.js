/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <xqkchina@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import { Button } from 'antd';
import { hasPermission } from 'libs';


export default function AuthButton(props) {
  let disabled = props.disabled;
  if (props.auth && !hasPermission(props.auth)) {
    disabled = true;
  }
  return disabled ? null : <Button {...props}>{props.children}</Button>
}
