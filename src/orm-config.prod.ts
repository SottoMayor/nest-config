import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  migrationsTableName: 'migrations',
  name: 'default',
  type: 'postgres',
  port: 5432,
  host: '',
  username: '',
  password: '',
  database: '',
  logging: false,
  synchronize: false,
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['src/database/migrations/**/*{.ts,.js}'],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  seedTracking: false,
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(() => {
    console.log('The datasource is up and running!');
  })
  .catch(() => {
    console.log('The datasource crashed!');
  });

export default dataSource;