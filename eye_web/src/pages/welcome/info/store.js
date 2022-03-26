/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <xqkchina@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import { observable } from 'mobx';
import http from 'libs/http';

class Store {
  @observable user = {};

  fetchUser = () => {
    return http.get('/api/account/self/')
      .then(res => this.user = res)
  }
}

export default new Store()
