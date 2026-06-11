import { DataSource } from 'typeorm';
import datasourceOptions from '../core/constants/datasourceOptions';
import { User } from './entities/User';
import { AlertHistory } from './entities/AlertHistory';
import { AlertRule } from './entities/AlertRule';
import { AlertType } from './entities/AlertType';
import path from 'path';

const AppDatasource = new DataSource({
  ...datasourceOptions(),
  entities: [User, AlertHistory, AlertRule, AlertType],
  migrations: [path.join(__dirname, '../db/migrations/*.{ts,js}')],
  migrationsTableName: 'Gaslighter_Migrations',
});

export default AppDatasource;
