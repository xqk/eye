/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <xqkchina@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import { observable } from "mobx";
import { http, includes } from 'libs';

class Store {
  @observable records = [];
  @observable types = [];
  @observable record = {};
  @observable isFetching = false;
  @observable formVisible = false;

  @observable f_name;
  @observable f_type;

  get dataSource() {
    let data = this.records
    if (this.f_name) data = data.filter(x => includes(x.name, this.f_name))
    if (this.f_type) data = data.filter(x => includes(x.type, this.f_type))
    return data
  }

  fetchRecords = () => {
    this.isFetching = true;
    http.get('/api/exec/template/')
      .then(({types, templates}) => {
        this.records = templates;
        this.types = types
      })
      .finally(() => this.isFetching = false)
  };

  showForm = (info = {interpreter: 'sh', host_ids: []}) => {
    this.formVisible = true;
    this.record = info
  }
}

export default new Store()
