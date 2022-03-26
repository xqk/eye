/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <xqkchina@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import {Card } from 'antd';

export default function (props) {
  return (
    <Card>
      <div>{localStorage.getItem('nickname')}, 欢迎你</div>
    </Card>
  )
}
