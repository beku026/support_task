import { useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import axios from 'axios'
import { DownloadOutlined } from '@ant-design/icons'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { iColumn, iData, ISourse } from './types'

const TableData = () => {
  const [dataSource, setDataSourse] = useState<ISourse[]>([])
  const columns: iColumn[] = [
    {
      title: '№',
      dataIndex: '№',
      key: '№',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ]

  useEffect(() => {
    fetchingData()
  }, [])

  const fetchingData = async () => {
    const { data } = await axios.get<iData[]>(
      'https://jsonplaceholder.typicode.com/users?_limit=5'
    )
    data.map((user) => {
      setDataSourse((prev) => [
        ...prev,
        {
          ['№']: user.id,
          name: user.name,
          title: user.username,
          email: user.email,
        },
      ])
    })
  }

    const handleXLSXExport = () => {
      const data = [columns.map(item => item.title), ...dataSource.map(item => [item['№'], item.name, item.title, item.email])]
      const worksheet = XLSX.utils.aoa_to_sheet(data)      
      worksheet['!cols'] = [{ width: 4 }, { width: 35 }, { width: 35 }, { width: 35 },]
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Support')
      const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      const xlsxBlob = new Blob([xlsxData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(xlsxBlob, 'data.xlsx')
    }
    

  const handlePDFExport = () => {
    const pdfDoc = new jsPDF()
    autoTable(pdfDoc, {
      head: [columns.map((heading) => heading.title)],
      body: dataSource.map((tableBody) => [
        tableBody['№'],
        tableBody.name,
        tableBody.title,
        tableBody.email,
      ]),
    })
    pdfDoc.save('Support.pdf')
  }

  return (
    <div>
      <Table bordered={true} pagination={false} size="small" dataSource={dataSource} columns={columns} />
      <Button
        type="primary"
        onClick={handlePDFExport}
        icon={<DownloadOutlined />}
        size={'large'}
      >
        Export to PDF
      </Button>
      <Button
        type="primary"
        onClick={handleXLSXExport}
        icon={<DownloadOutlined />}
        size={'large'}
      >
        Export to XLSX
      </Button>
    </div>
  )
}

export default TableData
