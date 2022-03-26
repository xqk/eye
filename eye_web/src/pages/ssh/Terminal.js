/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <eye.icl.site@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { X_TOKEN } from 'libs';
import 'xterm/css/xterm.css';
import styles from './index.module.less';


function WebSSH(props) {
  const container = useRef();
  const [term] = useState(new Terminal());
  const [fitPlugin] = useState(new FitAddon());

  useEffect(() => {
    term.loadAddon(fitPlugin);
    term.setOption('fontFamily', 'Source Code Pro, Courier New, Courier, Monaco, monospace, PingFang SC, Microsoft YaHei')
    term.open(container.current);
    term.write('WebSocket connecting ... ');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/ws/ssh/${props.id}/?x-token=${X_TOKEN}`);
    socket.onmessage = e => _read_as_text(e.data);
    socket.onopen = () => {
      term.write('ok')
      term.focus();
      fitPlugin.fit();
    };
    socket.onclose = e => {
      setTimeout(() => term.write('\r\nConnection is closed.\r\n'), 200)
    };
    term.onData(data => socket.send(JSON.stringify({data})));
    term.onResize(({cols, rows}) => {
      if (socket.readyState === 1) {
        socket.send(JSON.stringify({resize: [cols, rows]}))
      }
    });
    window.addEventListener('resize', fitTerminal)

    return () => {
      window.removeEventListener('resize', fitTerminal);
      if (socket) socket.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.vId === props.activeId) {
      setTimeout(() => term.focus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.activeId])

  useLayoutEffect(fitTerminal)

  function fitTerminal() {
    if (props.vId === props.activeId) {
      const dims = fitPlugin.proposeDimensions();
      if (!dims || !term || !dims.cols || !dims.rows) return;
      if (term.rows !== dims.rows || term.cols !== dims.cols) {
        term._core._renderService.clear();
        term.resize(dims.cols, dims.rows);
      }
    }
  }

  function _read_as_text(data) {
    const reader = new window.FileReader();
    reader.onload = () => term.write(reader.result);
    reader.readAsText(data, 'utf-8')
  }

  return (
    <div className={styles.terminal} ref={container}/>
  )
}

export default WebSSH