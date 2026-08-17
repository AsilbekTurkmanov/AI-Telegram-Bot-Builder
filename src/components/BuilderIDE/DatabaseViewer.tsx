import React from 'react';
import { Database, Table, Key, Hash, FileText } from 'lucide-react';
import { Project } from '../../types/project';

interface DatabaseViewerProps {
  project: Project;
}

interface DbColumn {
  name: string;
  type: string;
  pk: boolean;
  null: boolean;
  fk?: string;
  index?: boolean;
}

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({ project }) => {
  const tables: { name: string; columns: DbColumn[] }[] = [
    {
      name: 'Users',
      columns: [
        { name: 'Id', type: 'bigint', pk: true, null: false },
        { name: 'TelegramId', type: 'bigint', pk: false, null: false, index: true },
        { name: 'FirstName', type: 'text', pk: false, null: false },
        { name: 'PhoneNumber', type: 'text', pk: false, null: true },
        { name: 'LanguageCode', type: 'varchar(10)', pk: false, null: false },
        { name: 'Role', type: 'varchar(20)', pk: false, null: false },
        { name: 'CreatedAt', type: 'timestamp with time zone', pk: false, null: false }
      ]
    },
    {
      name: 'Products',
      columns: [
        { name: 'Id', type: 'uuid', pk: true, null: false },
        { name: 'Name', type: 'text', pk: false, null: false },
        { name: 'Price', type: 'numeric(18,2)', pk: false, null: false },
        { name: 'Category', type: 'text', pk: false, null: false },
        { name: 'Stock', type: 'integer', pk: false, null: false },
        { name: 'IsActive', type: 'boolean', pk: false, null: false }
      ]
    },
    {
      name: 'Orders',
      columns: [
        { name: 'Id', type: 'uuid', pk: true, null: false },
        { name: 'UserId', type: 'bigint', pk: false, fk: 'Users(Id)', null: false },
        { name: 'ItemsJson', type: 'jsonb', pk: false, null: false },
        { name: 'TotalAmount', type: 'numeric(18,2)', pk: false, null: false },
        { name: 'DeliveryAddress', type: 'text', pk: false, null: false },
        { name: 'Status', type: 'varchar(30)', pk: false, null: false },
        { name: 'CreatedAt', type: 'timestamp with time zone', pk: false, null: false }
      ]
    }
  ];

  return (
    <div className="database-viewer-container">
      <div className="db-viewer-header">
        <Database size={20} color="#4ade80" />
        <div>
          <h3>PostgreSQL ER Schema Inspector</h3>
          <span className="text-muted">Entity Framework Core 10 Generated Models</span>
        </div>
      </div>

      <div className="db-tables-grid">
        {tables.map((tbl) => (
          <div key={tbl.name} className="db-table-card">
            <div className="table-card-header">
              <Table size={18} color="#38bdf8" />
              <h4>{tbl.name}</h4>
              <span className="count-tag">{tbl.columns.length} columns</span>
            </div>

            <table className="schema-table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Type</th>
                  <th>Key / Index</th>
                </tr>
              </thead>
              <tbody>
                {tbl.columns.map((col) => (
                  <tr key={col.name}>
                    <td className="col-name flex-align">
                      {col.pk && <span title="Primary Key"><Key size={12} color="#facc15" /></span>}
                      {col.fk && <span title={`Foreign Key: ${col.fk}`}><Hash size={12} color="#c084fc" /></span>}
                      <span>{col.name}</span>
                    </td>
                    <td className="col-type">{col.type}</td>
                    <td className="col-meta">
                      {col.pk && <span className="badge badge-warning">PK</span>}
                      {col.fk && <span className="badge badge-purple">FK</span>}
                      {col.index && <span className="badge badge-primary">INDEX</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};
