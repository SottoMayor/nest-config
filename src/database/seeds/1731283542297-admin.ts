import { User } from '../../users/entities/user.entity'
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as dotenv from 'dotenv';
dotenv.config(); 

export class Admin1731283542297 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource
    ): Promise<any> {
        const userRepository = dataSource.getRepository(User);

        const existingAdmin = await userRepository.findOneBy({ isAdmin: true });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        const email = 'admin@admin.com'
        const password = process.env.ADMIN_PASSWORD

        const adminUser = {
            email: email,
            password: password,
            is_admin: true,
            birthdate: new Date('2000-05-13'),
            name: 'Super User',
            height: 1.89,
            weight: 90,
            gender: "M",
            isAdmin: true
        };

        const admin = userRepository.create(adminUser)
        await userRepository.save(admin);
        
    }
}
