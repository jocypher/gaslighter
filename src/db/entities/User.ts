import { AfterUpdate, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import bcrypt from "bcryptjs"



@Entity("users")
export class User{
    @PrimaryGeneratedColumn("uuid")
     id: string

     @Column("varchar",{unique: true,length: 100})
     userName: string

     @Column({unique: true})
     email: string

     @Column()
     password: string

     @Column()
     accessToken: string
     
     @Column({nullable: true })
     phoneNumber: string
     
     @CreateDateColumn()
     createdDate: Date
     
     @UpdateDateColumn()
     lastUpdate: Date
    

     @BeforeInsert()
     @BeforeUpdate()
     async hashPassword(){
         if(this.password && !this.password.startsWith('$2a$')){
            this.password = await bcrypt.hash(this.password, 10); 
         }
     }



     async validatePassword(password:string): Promise<boolean>{
        return await bcrypt.compare(password, this.password)
     }


     

}