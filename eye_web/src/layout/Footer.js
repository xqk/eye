/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <eye.icl.site@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React from 'react';
import { Layout } from 'antd';
import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';
import styles from './layout.module.less';


export default function () {
  return (
    <Layout.Footer style={{padding: 0}}>
      <div className={styles.footer}>
        <div className={styles.links}>
          <a className={styles.item} title="官网" href="https://eye.icl.site" target="_blank"
             rel="noopener noreferrer">官网</a>
          <a className={styles.item} title="Github" href="https://github.com/xqk/eye" target="_blank"
             rel="noopener noreferrer"><GithubOutlined/></a>
          <a title="文档" href="https://eye.icl.site/docs/about-eye/" target="_blank"
             rel="noopener noreferrer">文档</a>
        </div>
        <div style={{color: 'rgba(0, 0, 0, .45)'}}>
          Copyright <CopyrightOutlined/> {new Date().getFullYear()} By xqk
        </div>
      </div>
    </Layout.Footer>
  )
}
