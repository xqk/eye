/**
 * Copyright (c) xqk Organization. https://github.com/xqk/eye
 * Copyright (c) <xqkchina@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React, { useEffect, useState } from 'react';
import { Card, List, Modal, Form, Input, Switch, Divider, Typography } from 'antd';
import { DownSquareOutlined, PlusOutlined, UpSquareOutlined, SoundOutlined, DeleteOutlined } from '@ant-design/icons';
import { AuthButton } from 'components';
import { http } from 'libs';
import styles from './index.module.less';

function NoticeIndex(props) {
  const id = localStorage.getItem('id');
  const [form] = Form.useForm();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState();
  const [notice, setNotice] = useState();

  useEffect(() => {
    fetchRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function fetchRecords() {
    setFetching(true);
    http.get('/api/home/notice/')
      .then(res => {
        setRecords(res);
        for (let item of res) {
          if (item.is_stress && !item.read_ids.includes(id)) {
            setNotice(item)
          }
        }
      })
      .finally(() => setFetching(false))
  }

  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    formData['id'] = record.id;
    http.post('/api/home/notice/', formData)
      .then(() => {
        fetchRecords()
        setRecord(null)
      })
      .finally(() => setLoading(false))
  }

  function showForm(info) {
    setRecord(info);
    setTimeout(() => form.resetFields())
  }

  function handleSort(e, info, sort) {
    e.stopPropagation();
    http.patch('/api/home/notice/', {id: info.id, sort})
      .then(() => fetchRecords())
  }

  function handleRead() {
    if (!notice.read_ids.includes(id)) {
      const formData = {id: notice.id, read: 1};
      http.patch('/api/home/notice/', formData)
        .then(() => fetchRecords())
    }
    setNotice(null);
  }

  function handleDelete(item) {
    Modal.confirm({
      title: '????????????',
      content: `??????????????????????????????${item.title}??????`,
      onOk: () => http.delete('/api/home/notice/', {params: {id: item.id}})
        .then(fetchRecords)
    })
  }

  return (
    <Card
      title="????????????"
      loading={fetching}
      className={styles.notice}
      extra={<AuthButton auth="admin" type="link"
                         onClick={() => setIsEdit(!isEdit)}>{isEdit ? '??????' : '??????'}</AuthButton>}>
      {isEdit ? (
        <List>
          <div className={styles.add} onClick={() => showForm({})}><PlusOutlined/>????????????</div>
          {records.map(item => (
            <List.Item key={item.id}>
              <div className={styles.item}>
                <UpSquareOutlined onClick={e => handleSort(e, item, 'up')}/>
                <Divider type="vertical"/>
                <DownSquareOutlined onClick={e => handleSort(e, item, 'down')}/>
                <div className={styles.title} style={{marginLeft: 24}} onClick={() => showForm(item)}>{item.title}</div>
                <DeleteOutlined style={{color: 'red', marginLeft: 12}} onClick={() => handleDelete(item)}/>
              </div>
            </List.Item>
          ))}
        </List>
      ) : (
        <List>
          {records.map(item => (
            <List.Item key={item.id} className={styles.item} onClick={() => setNotice(item)}>
              {!item.read_ids.includes(id) && <SoundOutlined style={{color: '#ff4d4f', marginRight: 4}}/>}
              <span className={styles.title}>{item.title}</span>
              <span className={styles.date}>{item.created_at.substr(0, 10)}</span>
            </List.Item>
          ))}
          {records.length === 0 && (
            <div style={{marginTop: 12, color: '#999'}}>??????????????????</div>
          )}
        </List>
      )}
      <Modal
        title="????????????"
        visible={record}
        onCancel={() => setRecord(null)}
        confirmLoading={loading}
        onOk={handleSubmit}>
        <Form form={form} initialValues={record} labelCol={{span: 5}} wrapperCol={{span: 18}}>
          <Form.Item name="is_stress" valuePropName="checked" tooltip="???????????????????????????????????????????????????" label="????????????">
            <Switch checkedChildren="??????" unCheckedChildren="??????"/>
          </Form.Item>
          <Form.Item required name="title" label="????????????">
            <Input placeholder="?????????"/>
          </Form.Item>
          <Form.Item required name="content" tooltip="" label="????????????">
            <Input.TextArea placeholder="?????????"/>
          </Form.Item>
        </Form>
      </Modal>
      {notice ? (
        <Modal title={notice.title} visible={notice} footer={null} onCancel={handleRead}>
          <Typography>
            {notice.content.split('\n').map((item, index) => (
              <Typography.Paragraph key={index}>{item}</Typography.Paragraph>
            ))}
          </Typography>
        </Modal>
      ) : null}
    </Card>
  )
}

export default NoticeIndex