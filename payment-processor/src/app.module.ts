import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from './payments/payments.module';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/payments'),
    SqsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
