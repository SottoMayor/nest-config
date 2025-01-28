import { Profession } from '../../professions/entities/profession.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class Professions1736894516128 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource
    ): Promise<any> {

    const professionRepository = dataSource.getRepository(Profession);

    const [_, profNumber] = await professionRepository.findAndCount();
    if (profNumber > 0) {
        console.log('Profissões já cadastradas.');
        return;
    }

    const professions = [
        {
          name: 'Software Engineer',
          areaExpertise: 'Backend Development',
          averageSalary: 80000,
          inPerson: false,
        },
        {
          name: 'Frontend Developer',
          areaExpertise: 'UI/UX Design',
          averageSalary: 75000,
          inPerson: false,
        },
        {
          name: 'Data Scientist',
          areaExpertise: 'Machine Learning',
          averageSalary: 90000,
          inPerson: false,
        },
        {
          name: 'DevOps Engineer',
          areaExpertise: 'Infrastructure and Automation',
          averageSalary: 85000,
          inPerson: false,
        },
        {
          name: 'Mobile Developer',
          areaExpertise: 'iOS and Android Development',
          averageSalary: 78000,
          inPerson: false,
        },
        {
          name: 'Cloud Architect',
          areaExpertise: 'Cloud Infrastructure',
          averageSalary: 100000,
          inPerson: false,
        },
        {
          name: 'AI Engineer',
          areaExpertise: 'Artificial Intelligence',
          averageSalary: 95000,
          inPerson: false,
        },
        {
          name: 'Cybersecurity Specialist',
          areaExpertise: 'Network Security',
          averageSalary: 88000,
          inPerson: false,
        },
        {
          name: 'Product Manager',
          areaExpertise: 'Product Development',
          averageSalary: 85000,
          inPerson: false,
        },
        {
          name: 'QA Engineer',
          areaExpertise: 'Quality Assurance',
          averageSalary: 70000,
          inPerson: true,
        },
      ];

      await professionRepository.save(professions);

      console.log('Profissões adicionadas com sucesso!');
    }
}