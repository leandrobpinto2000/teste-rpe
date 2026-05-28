import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  DeleteMessageCommand,
  GetQueueUrlCommand,
  Message,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService implements OnModuleDestroy {
  private readonly logger = new Logger(SqsService.name);
  private readonly client: SQSClient;
  private readonly queueUrlCache = new Map<string, string>();

  constructor() {
    this.client = new SQSClient({
      endpoint: process.env.SQS_ENDPOINT ?? 'http://localhost:4566',
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? 'test',
      },
    });
  }

  onModuleDestroy(): void {
    this.client.destroy();
  }

  async getQueueUrl(queueName: string): Promise<string> {
    const cached = this.queueUrlCache.get(queueName);
    if (cached) return cached;

    const { QueueUrl } = await this.client.send(
      new GetQueueUrlCommand({ QueueName: queueName }),
    );
    if (!QueueUrl) {
      throw new Error(`Fila ${queueName} nao encontrada`);
    }
    this.queueUrlCache.set(queueName, QueueUrl);
    return QueueUrl;
  }

  async sendMessage<T>(queueName: string, payload: T, groupId?: string): Promise<void> {
    const queueUrl = await this.getQueueUrl(queueName);
    const isFifo = queueName.endsWith('.fifo');

    await this.client.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
        ...(isFifo && { MessageGroupId: groupId ?? 'default' }),
      }),
    );

    this.logger.log(`Mensagem publicada em ${queueName}`);
  }

  async receiveMessages(queueName: string, waitTimeSeconds = 20): Promise<Message[]> {
    const queueUrl = await this.getQueueUrl(queueName);
    const { Messages } = await this.client.send(
      new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: waitTimeSeconds,
      }),
    );
    return Messages ?? [];
  }

  async deleteMessage(queueName: string, receiptHandle: string): Promise<void> {
    const queueUrl = await this.getQueueUrl(queueName);
    await this.client.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      }),
    );
  }
}
