import { User } from '../../users/entities/user.entity'
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { genSalt, hash } from 'bcrypt';

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
        const salt = await genSalt(12)
        const hashedPassword = await hash(email, salt);

        const adminUser = {
            email: email,
            password: hashedPassword,
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
